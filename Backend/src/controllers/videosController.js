const { getPool } = require("../config/db");
const path = require("path");
const fs = require("fs").promises;

const VIDEOS_DIR = path.join(__dirname, "../../uploads/videos");
const THUMBNAILS_DIR = path.join(__dirname, "../../uploads/thumbnails");

// Ensure directories exist
const ensureDirectories = async () => {
  try {
    await fs.mkdir(VIDEOS_DIR, { recursive: true });
    await fs.mkdir(THUMBNAILS_DIR, { recursive: true });
  } catch (error) {
    console.error("Error creating directories:", error);
  }
};

ensureDirectories();

const createVideosTable = async (connection) => {
  try {
    // Drop existing table if it exists (to ensure fresh schema)
    await connection.query(`DROP TABLE IF EXISTS videos`);
    
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS videos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        videoPath VARCHAR(500),
        videoId VARCHAR(255),
        type ENUM('youtube', 'custom') DEFAULT 'youtube',
        thumbnailPath VARCHAR(500),
        created_by_id CHAR(36),
        updated_by_id CHAR(36),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by_id) REFERENCES users(user_id) ON DELETE SET NULL,
        FOREIGN KEY (updated_by_id) REFERENCES users(user_id) ON DELETE SET NULL
      )
    `;
    await connection.query(createTableQuery);
  } catch (error) {
    console.error("Error creating videos table:", error);
    throw error;
  }
};

const getVideos = async (req, res) => {
  try {
    const pool = getPool();
    const [videos] = await pool.query(
      `SELECT id, title, videoId, videoPath, thumbnailPath, type, created_by_id, updated_by_id, 
              createdAt, updatedAt FROM videos ORDER BY createdAt DESC`
    );
    
    // Add full URLs for video and thumbnail paths
    const videosWithUrls = videos.map(video => ({
      ...video,
      videoUrl: video.videoPath ? `/uploads/videos/${path.basename(video.videoPath)}` : null,
      thumbnailUrl: video.thumbnailPath ? `/uploads/thumbnails/${path.basename(video.thumbnailPath)}` : null
    }));
    
    res.status(200).json(videosWithUrls);
  } catch (error) {
    console.error("Error fetching videos:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching videos",
      error: error.message,
    });
  }
};

const getVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = getPool();
    const [videos] = await pool.query(
      `SELECT id, title, videoId, videoPath, thumbnailPath, type, created_by_id, updated_by_id, 
              createdAt, updatedAt FROM videos WHERE id = ?`,
      [id]
    );

    if (videos.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    const video = videos[0];
    video.videoUrl = video.videoPath ? `/uploads/videos/${path.basename(video.videoPath)}` : null;
    video.thumbnailUrl = video.thumbnailPath ? `/uploads/thumbnails/${path.basename(video.thumbnailPath)}` : null;

    res.status(200).json(video);
  } catch (error) {
    console.error("Error fetching video:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching video",
      error: error.message,
    });
  }
};

const createVideo = async (req, res) => {
  try {
    // FormData fields are in req.body when using express-fileupload
    let title = req.body.title;
    let videoId = req.body.videoId;
    let type = req.body.type || "youtube";
    let created_by_id = req.body.created_by_id;  // UUID string from user.user_id
    
    const files = req.files || {};

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    // For YouTube videos
    if (type === "youtube" && !videoId) {
      return res.status(400).json({
        success: false,
        message: "YouTube video ID is required",
      });
    }

    // For custom videos, file is required
    if (type === "custom" && !files.video) {
      return res.status(400).json({
        success: false,
        message: "Video file is required for custom videos",
      });
    }

    const pool = getPool();
    await createVideosTable(pool);

    let videoPath = null;
    let thumbnailPath = null;

    // Handle video file upload
    if (files.video) {
      const videoFile = files.video;
      const videoFileName = `${Date.now()}-${videoFile.name}`;
      videoPath = path.join(VIDEOS_DIR, videoFileName);
      
      await videoFile.mv(videoPath);
    }

    // Handle thumbnail upload
    if (files.thumbnail) {
      const thumbnailFile = files.thumbnail;
      const thumbnailFileName = `${Date.now()}-${thumbnailFile.name}`;
      thumbnailPath = path.join(THUMBNAILS_DIR, thumbnailFileName);
      
      await thumbnailFile.mv(thumbnailPath);
    }

    const [result] = await pool.query(
      `INSERT INTO videos (title, videoId, videoPath, thumbnailPath, type, created_by_id, updated_by_id) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [title, videoId || null, videoPath || null, thumbnailPath || null, type, created_by_id || null, created_by_id || null]
    );

    res.status(201).json({
      success: true,
      message: "Video created successfully",
      id: result.insertId,
      data: {
        id: result.insertId,
        title,
        videoId,
        type: type || "youtube",
        created_by_id: created_by_id || null,
        updated_by_id: created_by_id || null,
      },
    });
  } catch (error) {
    console.error("Error creating video:", error);
    res.status(500).json({
      success: false,
      message: "Error creating video",
      error: error.message,
    });
  }
};

const updateVideo = async (req, res) => {
  try {
    const { id } = req.params;
    let title = req.body.title;
    let videoId = req.body.videoId;
    let type = req.body.type || "youtube";
    let updated_by_id = req.body.updated_by_id;  // UUID string from user.user_id
    
    const files = req.files || {};

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    const pool = getPool();

    // Get existing video to handle file deletion
    const [existingVideos] = await pool.query("SELECT videoPath, thumbnailPath FROM videos WHERE id = ?", [id]);
    
    if (existingVideos.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    const existing = existingVideos[0];
    let videoPath = existing.videoPath;
    let thumbnailPath = existing.thumbnailPath;

    // Handle new video file upload
    if (files.video) {
      // Delete old video if exists
      if (existing.videoPath) {
        try {
          await fs.unlink(existing.videoPath);
        } catch (err) {
          console.error("Error deleting old video:", err);
        }
      }

      const videoFile = files.video;
      const videoFileName = `${Date.now()}-${videoFile.name}`;
      videoPath = path.join(VIDEOS_DIR, videoFileName);
      
      await videoFile.mv(videoPath);
    }

    // Handle new thumbnail upload
    if (files.thumbnail) {
      // Delete old thumbnail if exists
      if (existing.thumbnailPath) {
        try {
          await fs.unlink(existing.thumbnailPath);
        } catch (err) {
          console.error("Error deleting old thumbnail:", err);
        }
      }

      const thumbnailFile = files.thumbnail;
      const thumbnailFileName = `${Date.now()}-${thumbnailFile.name}`;
      thumbnailPath = path.join(THUMBNAILS_DIR, thumbnailFileName);
      
      await thumbnailFile.mv(thumbnailPath);
    }

    const [result] = await pool.query(
      "UPDATE videos SET title = ?, videoId = ?, videoPath = ?, thumbnailPath = ?, type = ?, updated_by_id = ? WHERE id = ?",
      [title, videoId || null, videoPath || null, thumbnailPath || null, type || "youtube", updated_by_id || null, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Video updated successfully",
      data: {
        id,
        title,
        videoId,
        type: type || "youtube",
        updated_by: updated_by || null,
      },
    });
  } catch (error) {
    console.error("Error updating video:", error);
    res.status(500).json({
      success: false,
      message: "Error updating video",
      error: error.message,
    });
  }
};

const deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = getPool();

    // Get video files to delete
    const [videos] = await pool.query("SELECT videoPath, thumbnailPath FROM videos WHERE id = ?", [id]);

    if (videos.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    const { videoPath, thumbnailPath } = videos[0];

    // Delete files from disk
    if (videoPath) {
      try {
        await fs.unlink(videoPath);
      } catch (err) {
        console.error("Error deleting video file:", err);
      }
    }

    if (thumbnailPath) {
      try {
        await fs.unlink(thumbnailPath);
      } catch (err) {
        console.error("Error deleting thumbnail file:", err);
      }
    }

    // Delete from database
    const [result] = await pool.query("DELETE FROM videos WHERE id = ?", [id]);

    res.status(200).json({
      success: true,
      message: "Video deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting video:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting video",
      error: error.message,
    });
  }
};

module.exports = {
  getVideos,
  getVideo,
  createVideo,
  updateVideo,
  deleteVideo,
  createVideosTable,
};
