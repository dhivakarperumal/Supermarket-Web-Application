import React, { useContext, useState, useEffect } from "react";
import { useAuth } from "../../PrivateRouter/AuthContext";
import api from "../../api";
import { toast, Toaster } from "react-hot-toast";
import {
    FiMail, FiPhone, FiMapPin, FiShield,
    FiCamera, FiCheck, FiKey, FiLock,
    FiX, FiEdit2, FiUser, FiCalendar, FiLoader
} from "react-icons/fi";

/* ─── Inline styles ───────────────────────────────────── */
const S = {
    page: {
        minHeight: "100vh",
        background: "linear-gradient(135deg,#f0fdf4 0%,#ecfdf5 40%,#f0f9ff 100%)",
        fontFamily: "'Inter',system-ui,sans-serif",
        paddingBottom: "3rem",
    },
    /* Hero banner */
    heroBanner: {
        background: "linear-gradient(135deg,#064e3b 0%,#065f46 40%,#047857 70%,#059669 100%)",
        padding: "3rem 2rem 5rem",
        position: "relative",
        overflow: "hidden",
    },
    heroDots: {
        position: "absolute", inset: 0,
        backgroundImage: "radial-gradient(circle,rgba(255,255,255,0.07) 1px,transparent 1px)",
        backgroundSize: "28px 28px",
    },
    heroOrb1: {
        position: "absolute", top: "-60px", right: "-60px",
        width: "240px", height: "240px", borderRadius: "50%",
        background: "radial-gradient(circle,rgba(52,211,153,0.3),transparent 70%)",
    },
    heroOrb2: {
        position: "absolute", bottom: "-40px", left: "10%",
        width: "180px", height: "180px", borderRadius: "50%",
        background: "radial-gradient(circle,rgba(16,185,129,0.2),transparent 70%)",
    },
    /* Content container */
    container: { maxWidth: "900px", margin: "0 auto", padding: "0 1.5rem" },
    /* Avatar ring */
    avatarWrap: {
        position: "relative",
        display: "inline-block",
        marginTop: "-4.5rem",
    },
    avatarRing: {
        width: "120px", height: "120px", borderRadius: "50%",
        border: "5px solid white",
        boxShadow: "0 8px 32px rgba(16,185,129,0.25)",
        overflow: "hidden", position: "relative",
        background: "#d1fae5",
    },
    avatarImg: { width: "100%", height: "100%", objectFit: "cover" },
    avatarOverlay: {
        position: "absolute", inset: 0, borderRadius: "50%",
        background: "rgba(0,0,0,0.45)",
        display: "flex", alignItems: "center", justifyContent: "center",
        opacity: 0, transition: "opacity 0.2s", cursor: "pointer",
    },
    cameraIcon: { color: "white", fontSize: "1.4rem" },
    /* Cards */
    glassCard: {
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderRadius: "24px",
        border: "1px solid rgba(255,255,255,0.6)",
        boxShadow: "0 8px 32px rgba(16,185,129,0.08)",
        padding: "1.75rem",
    },
    /* Info chip */
    infoChip: {
        display: "flex", alignItems: "center", gap: "0.75rem",
        padding: "1rem 1.25rem",
        background: "#f8fafc", borderRadius: "14px",
        border: "1px solid #e2e8f0",
        transition: "all 0.2s",
    },
    chipIcon: {
        width: "40px", height: "40px", borderRadius: "10px",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
    },
    /* Buttons */
    btnPrimary: {
        display: "inline-flex", alignItems: "center", gap: "0.5rem",
        padding: "0.75rem 1.5rem", borderRadius: "12px",
        background: "linear-gradient(135deg,#10b981,#059669)",
        color: "white", border: "none", cursor: "pointer",
        fontWeight: 700, fontSize: "0.9rem",
        boxShadow: "0 4px 14px rgba(16,185,129,0.35)",
        transition: "all 0.25s",
    },
    btnOutline: {
        display: "inline-flex", alignItems: "center", gap: "0.5rem",
        padding: "0.75rem 1.5rem", borderRadius: "12px",
        background: "white", color: "#374151",
        border: "1px solid #e5e7eb", cursor: "pointer",
        fontWeight: 700, fontSize: "0.9rem",
        transition: "all 0.25s",
    },
    /* Stat pill */
    statPill: {
        background: "rgba(255,255,255,0.12)",
        backdropFilter: "blur(8px)",
        borderRadius: "14px", border: "1px solid rgba(255,255,255,0.2)",
        padding: "0.85rem 1.25rem", textAlign: "center",
        minWidth: "110px",
    },
    /* Modal overlay */
    overlay: {
        position: "fixed", inset: 0, zIndex: 999,
        background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem",
    },
    modal: {
        background: "white", borderRadius: "24px",
        width: "100%", maxWidth: "520px",
        maxHeight: "90vh", overflowY: "auto",
        padding: "2rem", position: "relative",
        boxShadow: "0 24px 64px rgba(0,0,0,0.15)",
    },
    modalClose: {
        position: "absolute", top: "1rem", right: "1rem",
        width: "32px", height: "32px", borderRadius: "8px",
        background: "#f1f5f9", border: "none", cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "#64748b",
    },
    formInput: {
        width: "100%", padding: "0.75rem 1rem",
        borderRadius: "12px", border: "1px solid #e2e8f0",
        background: "#f8fafc", fontSize: "0.95rem",
        outline: "none", boxSizing: "border-box",
        transition: "border 0.2s, box-shadow 0.2s",
    },
    formLabel: {
        display: "block", fontSize: "0.8rem",
        fontWeight: 700, color: "#64748b",
        marginBottom: "0.4rem", textTransform: "uppercase", letterSpacing: "0.04em",
    },
    sectionTitle: {
        fontSize: "1.1rem", fontWeight: 800, color: "#0f172a",
        marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem",
    },
};

/* ─── Reusable Info Row ───────────────────────────────── */
const InfoRow = ({ icon, iconBg, iconColor, label, value }) => (
    <div style={S.infoChip}>
        <div style={{ ...S.chipIcon, background: iconBg }}>
            {React.cloneElement(icon, { style: { color: iconColor, fontSize: "1.1rem" } })}
        </div>
        <div>
            <p style={{ margin: 0, fontSize: "0.75rem", color: "#94a3b8", fontWeight: 700, textTransform: "uppercase" }}>{label}</p>
            <p style={{ margin: 0, fontWeight: 700, color: "#0f172a", fontSize: "0.95rem" }}>{value || "—"}</p>
        </div>
    </div>
);

/* ─── Profile Page ────────────────────────────────────── */
const Profile = () => {
    const { user, login } = useAuth();

    const [isPwdModalOpen, setIsPwdModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [changingPwd, setChangingPwd] = useState(false);
    const [avatarHover, setAvatarHover] = useState(false);

    const [currentPwd, setCurrentPwd] = useState("");
    const [newPwd, setNewPwd] = useState("");
    const [confirmPwd, setConfirmPwd] = useState("");

    const [profileData, setProfileData] = useState({
        username: "", name: "", email: "", phone: "",
        street_address: "", city: "", district: "",
        state: "", country: "India", zip_code: "",
        role: "", created_at: ""
    });

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/auth/profile/${user?.id}`);
            setProfileData({ ...res.data, country: res.data.country || "India" });
        } catch {
            setProfileData({
                username: user?.username || "", name: user?.name || "",
                email: user?.email || "", phone: user?.phone || "",
                street_address: "", city: "", district: "",
                state: "", country: "India", zip_code: "",
                role: user?.role || "", created_at: ""
            });
        } finally { setLoading(false); }
    };

    useEffect(() => { if (user?.id) fetchProfile(); }, [user?.id]);

    const handleProfileUpdate = async () => {
        if (!profileData.username.trim()) { toast.error("Username is required"); return; }
        if (!profileData.email.trim()) { toast.error("Email is required"); return; }
        try {
            setSaving(true);
            const res = await api.put(`/auth/profile/${user?.id}`, profileData);
            const token = localStorage.getItem("token");
            login({ ...user, ...res.data.user }, token);
            toast.success("Profile updated successfully!");
            setIsEditModalOpen(false);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update profile");
        } finally { setSaving(false); }
    };

    const handlePwdChange = async () => {
        if (!currentPwd.trim()) { toast.error("Enter your current password"); return; }
        if (newPwd.length < 6) { toast.error("New password must be at least 6 characters"); return; }
        if (newPwd !== confirmPwd) { toast.error("New passwords do not match"); return; }
        try {
            setChangingPwd(true);
            await api.put(`/auth/profile/${user?.id}/password`, { currentPassword: currentPwd, newPassword: newPwd });
            toast.success("Password changed successfully!");
            setIsPwdModalOpen(false);
            setCurrentPwd(""); setNewPwd(""); setConfirmPwd("");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to change password");
        } finally { setChangingPwd(false); }
    };

    const locationDisplay = [profileData.city, profileData.state, profileData.country].filter(Boolean).join(", ") || "Not set";
    const memberSince = profileData.created_at
        ? new Date(profileData.created_at).toLocaleDateString("en-IN", { year: "numeric", month: "long" })
        : "—";
    const displayName = profileData.name || profileData.username || "Admin User";
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=059669&color=fff&size=200`;

    if (loading) return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "400px" }}>
            <div style={{ textAlign: "center" }}>
                <FiLoader style={{ fontSize: "2.5rem", color: "#10b981", animation: "spin 1s linear infinite" }} />
                <p style={{ marginTop: "1rem", color: "#64748b", fontWeight: 600 }}>Loading profile...</p>
            </div>
        </div>
    );

    return (
        <div style={S.page}>
            <Toaster position="top-right" />

            {/* ── Hero Banner ─────────────────────── */}
            <div style={S.heroBanner}>
                <div style={S.heroDots} />
                <div style={S.heroOrb1} />
                <div style={S.heroOrb2} />
                <div style={{ ...S.container, position: "relative", zIndex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap" }}>
                        {/* Stat pills in hero */}
                        <div style={{ marginLeft: "auto", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                            {[
                                { label: "Role", value: profileData.role || "Admin" },
                                { label: "Member Since", value: memberSince },
                                { label: "Status", value: "● Active" },
                            ].map(s => (
                                <div key={s.label} style={S.statPill}>
                                    <p style={{ margin: 0, fontSize: "0.7rem", color: "rgba(255,255,255,0.6)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.label}</p>
                                    <p style={{ margin: 0, fontSize: "0.95rem", color: "white", fontWeight: 800 }}>{s.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Main Body ───────────────────────── */}
            <div style={{ ...S.container, marginTop: 0 }}>

                {/* ── Profile Header Card ─── */}
                <div style={{ ...S.glassCard, marginBottom: "1.5rem" }}>
                    <div style={{ display: "flex", alignItems: "flex-end", gap: "1.5rem", flexWrap: "wrap" }}>
                        {/* Avatar */}
                        <div
                            style={S.avatarWrap}
                            onMouseEnter={() => setAvatarHover(true)}
                            onMouseLeave={() => setAvatarHover(false)}
                        >
                            <div style={S.avatarRing}>
                                <img src={avatarUrl} alt="Avatar" style={S.avatarImg} />
                                <div style={{ ...S.avatarOverlay, opacity: avatarHover ? 1 : 0 }}>
                                    <FiCamera style={S.cameraIcon} />
                                </div>
                            </div>
                            {/* Online badge */}
                            <span style={{
                                position: "absolute", bottom: "6px", right: "6px",
                                width: "18px", height: "18px", borderRadius: "50%",
                                background: "#10b981", border: "3px solid white",
                            }} />
                        </div>

                        {/* Name & Meta */}
                        <div style={{ flex: 1, paddingBottom: "0.25rem" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                                <h1 style={{ margin: 0, fontSize: "1.8rem", fontWeight: 900, color: "#0f172a", letterSpacing: "-0.03em" }}>
                                    {displayName}
                                </h1>
                                <span style={{
                                    background: "linear-gradient(135deg,#d1fae5,#a7f3d0)",
                                    color: "#065f46", fontSize: "0.75rem",
                                    fontWeight: 800, padding: "0.2rem 0.75rem",
                                    borderRadius: "9999px", border: "1px solid #6ee7b7",
                                }}>
                                    ✓ Verified
                                </span>
                            </div>
                            <p style={{ margin: "0.35rem 0 0.75rem", color: "#64748b", fontWeight: 600, fontSize: "0.95rem" }}>
                                @{profileData.username} · {profileData.role || "Super Admin"}
                            </p>
                            <div style={{ display: "flex", gap: "1.25rem", flexWrap: "wrap" }}>
                                {[
                                    { icon: <FiMail />, text: profileData.email || "—", color: "#3b82f6" },
                                    { icon: <FiPhone />, text: profileData.phone || "Not set", color: "#8b5cf6" },
                                    { icon: <FiMapPin />, text: locationDisplay, color: "#ef4444" },
                                ].map(({ icon, text, color }) => (
                                    <span key={text} style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.85rem", color: "#64748b", fontWeight: 600 }}>
                                        {React.cloneElement(icon, { style: { color, fontSize: "1rem", flexShrink: 0 } })}
                                        {text}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                            <button style={S.btnOutline} onClick={() => setIsEditModalOpen(true)}>
                                <FiEdit2 /> Edit Profile
                            </button>
                            <button style={S.btnPrimary} onClick={() => setIsPwdModalOpen(true)}>
                                <FiLock /> Change Password
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── Info Cards Row ─── */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>

                    {/* Personal Info */}
                    <div style={S.glassCard}>
                        <h2 style={S.sectionTitle}><FiUser style={{ color: "#10b981" }} /> Personal Info</h2>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                            <InfoRow icon={<FiUser />} iconBg="#eff6ff" iconColor="#3b82f6" label="Full Name" value={profileData.name || profileData.username} />
                            <InfoRow icon={<FiMail />} iconBg="#f5f3ff" iconColor="#8b5cf6" label="Email" value={profileData.email} />
                            <InfoRow icon={<FiPhone />} iconBg="#fdf4ff" iconColor="#d946ef" label="Phone" value={profileData.phone} />
                            <InfoRow icon={<FiShield />} iconBg="#ecfdf5" iconColor="#10b981" label="Role" value={profileData.role || "Admin"} />
                        </div>
                    </div>

                    {/* Address Info */}
                    <div style={S.glassCard}>
                        <h2 style={S.sectionTitle}><FiMapPin style={{ color: "#10b981" }} /> Address</h2>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                            <InfoRow icon={<FiMapPin />} iconBg="#fff7ed" iconColor="#f97316" label="Street" value={profileData.street_address} />
                            <InfoRow icon={<FiMapPin />} iconBg="#fef2f2" iconColor="#ef4444" label="City / District" value={[profileData.city, profileData.district].filter(Boolean).join(", ")} />
                            <InfoRow icon={<FiMapPin />} iconBg="#f0fdf4" iconColor="#22c55e" label="State" value={profileData.state} />
                            <InfoRow icon={<FiMapPin />} iconBg="#eff6ff" iconColor="#3b82f6" label="Country / ZIP" value={[profileData.country, profileData.zip_code].filter(Boolean).join(" – ")} />
                        </div>
                    </div>

                    {/* Account Details */}
                    <div style={S.glassCard}>
                        <h2 style={S.sectionTitle}><FiShield style={{ color: "#10b981" }} /> Account</h2>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                            <InfoRow icon={<FiUser />} iconBg="#ecfdf5" iconColor="#10b981" label="Username" value={profileData.username} />
                            <InfoRow icon={<FiCalendar />} iconBg="#f0fdf4" iconColor="#16a34a" label="Member Since" value={memberSince} />
                            <InfoRow icon={<FiShield />} iconBg="#d1fae5" iconColor="#059669" label="Status" value="Active" />
                            <InfoRow icon={<FiKey />} iconBg="#fefce8" iconColor="#ca8a04" label="Password" value="••••••••" />
                        </div>

                        <div style={{ marginTop: "1.25rem", padding: "1rem", borderRadius: "14px", background: "linear-gradient(135deg,#ecfdf5,#d1fae5)", border: "1px solid #a7f3d0" }}>
                            <p style={{ margin: 0, fontWeight: 800, color: "#064e3b", fontSize: "0.9rem" }}>🔒 Secure Account</p>
                            <p style={{ margin: "0.25rem 0 0", fontSize: "0.8rem", color: "#065f46" }}>Your account is protected with 2-step verification.</p>
                        </div>
                    </div>

                </div>
            </div>

            {/* ── Edit Modal ──────────────────────── */}
            {isEditModalOpen && (
                <div style={S.overlay} onClick={() => setIsEditModalOpen(false)}>
                    <div style={S.modal} onClick={e => e.stopPropagation()}>
                        <button style={S.modalClose} onClick={() => setIsEditModalOpen(false)}><FiX /></button>

                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.75rem" }}>
                            <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "linear-gradient(135deg,#10b981,#059669)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <FiEdit2 style={{ color: "white", fontSize: "1.2rem" }} />
                            </div>
                            <div>
                                <h2 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 800 }}>Edit Profile</h2>
                                <p style={{ margin: 0, fontSize: "0.8rem", color: "#64748b" }}>Update your personal information</p>
                            </div>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                            {[
                                { label: "Username *", key: "username", type: "text", col: 1 },
                                { label: "Full Name", key: "name", type: "text", col: 1 },
                                { label: "Email *", key: "email", type: "email", col: 2 },
                                { label: "Phone", key: "phone", type: "text", col: 2 },
                            ].map(f => (
                                <div key={f.key} style={{ gridColumn: f.col === 2 ? "1 / -1" : "auto" }}>
                                    <label style={S.formLabel}>{f.label}</label>
                                    <input
                                        type={f.type}
                                        style={S.formInput}
                                        value={profileData[f.key]}
                                        onChange={e => setProfileData({ ...profileData, [f.key]: e.target.value })}
                                        placeholder={f.label.replace(" *", "")}
                                    />
                                </div>
                            ))}
                        </div>

                        <p style={{ margin: "1.25rem 0 0.75rem", fontSize: "0.75rem", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" }}>📍 Address</p>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                            {[
                                { label: "Street Address", key: "street_address", col: 2 },
                                { label: "City", key: "city", col: 1 },
                                { label: "District", key: "district", col: 1 },
                                { label: "State", key: "state", col: 1 },
                                { label: "Country", key: "country", col: 1 },
                                { label: "ZIP Code", key: "zip_code", col: 1 },
                            ].map(f => (
                                <div key={f.key} style={{ gridColumn: f.col === 2 ? "1 / -1" : "auto" }}>
                                    <label style={S.formLabel}>{f.label}</label>
                                    <input
                                        type="text"
                                        style={S.formInput}
                                        value={profileData[f.key]}
                                        onChange={e => setProfileData({ ...profileData, [f.key]: e.target.value })}
                                        placeholder={f.label}
                                    />
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={handleProfileUpdate}
                            disabled={saving}
                            style={{ ...S.btnPrimary, width: "100%", justifyContent: "center", marginTop: "1.5rem", padding: "0.9rem", opacity: saving ? 0.7 : 1 }}
                        >
                            {saving ? <><FiLoader style={{ animation: "spin 1s linear infinite" }} /> Saving...</> : <><FiCheck /> Save Changes</>}
                        </button>
                    </div>
                </div>
            )}

            {/* ── Password Modal ──────────────────── */}
            {isPwdModalOpen && (
                <div style={S.overlay} onClick={() => setIsPwdModalOpen(false)}>
                    <div style={{ ...S.modal, maxWidth: "420px" }} onClick={e => e.stopPropagation()}>
                        <button style={S.modalClose} onClick={() => setIsPwdModalOpen(false)}><FiX /></button>

                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.75rem" }}>
                            <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "linear-gradient(135deg,#3b82f6,#1d4ed8)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <FiLock style={{ color: "white", fontSize: "1.2rem" }} />
                            </div>
                            <div>
                                <h2 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 800 }}>Change Password</h2>
                                <p style={{ margin: 0, fontSize: "0.8rem", color: "#64748b" }}>Keep your account secure</p>
                            </div>
                        </div>

                        {[
                            { label: "Current Password", val: currentPwd, set: setCurrentPwd, ph: "Enter current password" },
                            { label: "New Password", val: newPwd, set: setNewPwd, ph: "Minimum 6 characters" },
                            { label: "Confirm Password", val: confirmPwd, set: setConfirmPwd, ph: "Re-enter new password" },
                        ].map(f => (
                            <div key={f.label} style={{ marginBottom: "1rem" }}>
                                <label style={S.formLabel}>{f.label}</label>
                                <input
                                    type="password"
                                    style={S.formInput}
                                    value={f.val}
                                    onChange={e => f.set(e.target.value)}
                                    placeholder={f.ph}
                                />
                            </div>
                        ))}

                        <button
                            onClick={handlePwdChange}
                            disabled={changingPwd}
                            style={{ ...S.btnPrimary, background: "linear-gradient(135deg,#3b82f6,#1d4ed8)", width: "100%", justifyContent: "center", marginTop: "0.5rem", padding: "0.9rem", opacity: changingPwd ? 0.7 : 1 }}
                        >
                            {changingPwd ? <><FiLoader style={{ animation: "spin 1s linear infinite" }} /> Updating...</> : <><FiKey /> Update Password</>}
                        </button>
                    </div>
                </div>
            )}

            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
    );
};

export default Profile;
