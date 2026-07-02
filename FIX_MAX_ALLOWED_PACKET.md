# Fix: MySQL max_allowed_packet Error

## Problem
When creating categories with images, you get:
```
Error: Got a packet bigger than 'max_allowed_packet' bytes
```

This happens because base64-encoded images are too large for MySQL's default packet size limit (~4MB).

## Solution

### Step 1: Configure MySQL (Permanent Fix)

#### Option A: Using PowerShell Script (Recommended for Windows)
```powershell
cd "d:\Q Techx Projects\Q Techx Mobile App\Supermarket Web Application"
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
.\configure-mysql-max-packet.ps1
```

#### Option B: Manual Edit
1. Find your MySQL config file:
   - Windows: `C:\ProgramData\MySQL\MySQL Server 8.0\my.ini`
   - Linux: `/etc/mysql/my.cnf`
   - Mac: `/usr/local/etc/my.cnf`

2. Edit the file and find the `[mysqld]` section, add:
   ```ini
   [mysqld]
   max_allowed_packet = 256M
   ```

3. Restart MySQL:
   - **Windows Command Prompt (as Admin):**
     ```cmd
     net stop MySQL80
     net start MySQL80
     ```
   - **Or use Services app:** Press `Win + R` → `services.msc` → Find "MySQL80" → Right-click Restart

#### Option C: Temporary Fix (Current Session Only)
Run in MySQL:
```sql
SET GLOBAL max_allowed_packet = 268435456;
```

### Step 2: Verify the Setting

In MySQL, run:
```sql
SHOW VARIABLES LIKE 'max_allowed_packet';
```

Should show: `268435456` or `256M`

### Step 3: Test It

1. Restart the backend:
   ```powershell
   cd Backend
   npm start
   ```

2. Go to Admin → Categories → Add Category

3. Upload an image and save

## What Changed

- **Frontend**: Images are now compressed more aggressively (500KB max, 800px max dimension)
- **Backend**: Better error handling with helpful messages
- **MySQL**: Needs `max_allowed_packet = 256M` configuration

## Troubleshooting

If you still get the error:
1. Verify MySQL was restarted after config change
2. Check the `max_allowed_packet` value with: `SHOW VARIABLES LIKE 'max_allowed_packet';`
3. If you don't have SUPER privilege to set GLOBAL, contact your MySQL admin

## Long-term Solution (Future)

Store images as files on disk instead of in database:
- Reduces database bloat
- Improves performance
- Eliminates packet size issues
- Easier to serve images via CDN
