import React, { useState } from "react";
import SEO from "components/main/seo/seo";
import "./index.scss";

// Utility to convert file to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Strip the data:image/...;base64, prefix
      resolve(result.split(",")[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const AdminPage = (): JSX.Element => {
  const [token, setToken] = useState(typeof window !== "undefined" ? localStorage.getItem("gh_pat") || "" : "");
  const [repo, setRepo] = useState(typeof window !== "undefined" ? localStorage.getItem("gh_repo") || "cescrafli/Jocelyn-Rafli-Gallery" : "cescrafli/Jocelyn-Rafli-Gallery");
  
  const [files, setFiles] = useState<{ file: File; preview: string }[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState("");

  const handleTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setToken(e.target.value);
    localStorage.setItem("gh_pat", e.target.value);
  };

  const handleRepoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRepo(e.target.value);
    localStorage.setItem("gh_repo", e.target.value);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }));
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => {
      const newArr = [...prev];
      URL.revokeObjectURL(newArr[index].preview);
      newArr.splice(index, 1);
      return newArr;
    });
  };

  const handleUpload = async () => {
    if (!token) return alert("Tolong masukkan GitHub Token terlebih dahulu!");
    if (!repo) return alert("Tolong masukkan nama repository!");
    if (files.length === 0) return alert("Pilih foto terlebih dahulu!");

    setIsUploading(true);
    setProgress("Memulai proses upload...");

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
      };

      // 1. Get current commit
      setProgress("Mengambil data repository...");
      let res = await fetch(`https://api.github.com/repos/${repo}/git/refs/heads/master`, { headers });
      if (!res.ok) throw new Error("Gagal mengambil data branch master. Cek Token atau nama repo.");
      const refData = await res.json();
      const currentCommitSha = refData.object.sha;

      // 2. Get commit tree
      res = await fetch(`https://api.github.com/repos/${repo}/git/commits/${currentCommitSha}`, { headers });
      const commitData = await res.json();
      const currentTreeSha = commitData.tree.sha;

      // 3. Create blobs for each image
      const treeItems: any[] = [];
      for (let i = 0; i < files.length; i++) {
        setProgress(`Mengupload foto ${i + 1} dari ${files.length}...`);
        const base64Content = await fileToBase64(files[i].file);
        
        const blobRes = await fetch(`https://api.github.com/repos/${repo}/git/blobs`, {
          method: "POST",
          headers: { ...headers, "Content-Type": "application/json" },
          body: JSON.stringify({
            content: base64Content,
            encoding: "base64"
          })
        });
        const blobData = await blobRes.json();

        // Use a unique name to avoid conflicts
        const filename = `${Date.now()}_${files[i].file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;

        treeItems.push({
          path: `static/paintings/${filename}`,
          mode: "100644",
          type: "blob",
          sha: blobData.sha
        });
      }

      // 4. Create new tree
      setProgress("Membuat struktur folder baru...");
      const treeRes = await fetch(`https://api.github.com/repos/${repo}/git/trees`, {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({
          base_tree: currentTreeSha,
          tree: treeItems
        })
      });
      const newTreeData = await treeRes.json();

      // 5. Create new commit
      setProgress("Menyimpan perubahan (Commit)...");
      const newCommitRes = await fetch(`https://api.github.com/repos/${repo}/git/commits`, {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `Add ${files.length} new photos via Admin Dashboard`,
          tree: newTreeData.sha,
          parents: [currentCommitSha]
        })
      });
      const newCommitData = await newCommitRes.json();

      // 6. Update reference
      setProgress("Memperbarui branch master...");
      await fetch(`https://api.github.com/repos/${repo}/git/refs/heads/master`, {
        method: "PATCH",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({
          sha: newCommitData.sha,
          force: true
        })
      });

      setProgress("Berhasil! Website akan segera diupdate oleh Netlify.");
      setFiles([]);
      setTimeout(() => setProgress(""), 5000);

    } catch (error: any) {
      alert(`Upload gagal: ${error.message}`);
      setProgress("");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <SEO title="Admin Dashboard" />
      <div style={{ padding: "40px", maxWidth: "800px", margin: "0 auto", fontFamily: "sans-serif" }}>
        <h1>Gallery Admin Dashboard</h1>
        <p>Gunakan halaman ini untuk mengunggah banyak foto sekaligus secara otomatis.</p>
        
        <div style={{ marginBottom: "20px", padding: "20px", backgroundColor: "#f5f5f5", borderRadius: "8px", color: "black" }}>
          <h3>Pengaturan Akses</h3>
          <div style={{ marginBottom: "10px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>GitHub Repository:</label>
            <input 
              type="text" 
              value={repo} 
              onChange={handleRepoChange} 
              style={{ width: "100%", padding: "8px" }}
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>GitHub Personal Access Token:</label>
            <input 
              type="password" 
              value={token} 
              onChange={handleTokenChange} 
              placeholder="ghp_xxxxxxxxxxxx"
              style={{ width: "100%", padding: "8px" }}
            />
            <p style={{ fontSize: "12px", color: "#666", marginTop: "5px" }}>Token Anda hanya disimpan di browser (localStorage) dan aman.</p>
          </div>
        </div>

        <div style={{ marginBottom: "20px", padding: "20px", border: "2px dashed #ccc", borderRadius: "8px", textAlign: "center", color: "black" }}>
          <h3>Pilih Foto</h3>
          <input 
            type="file" 
            multiple 
            accept="image/*" 
            onChange={onFileChange} 
            style={{ fontSize: "16px", cursor: "pointer" }}
            disabled={isUploading}
          />
        </div>

        {files.length > 0 && (
          <div>
            <h3 style={{ color: "black" }}>Preview Foto ({files.length})</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "15px", marginBottom: "20px" }}>
              {files.map((f, i) => (
                <div key={i} style={{ position: "relative", width: "150px", height: "150px", border: "1px solid #ddd", borderRadius: "8px", overflow: "hidden" }}>
                  <img src={f.preview} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <button 
                    onClick={() => removeFile(i)}
                    style={{ position: "absolute", top: "5px", right: "5px", background: "red", color: "white", border: "none", borderRadius: "50%", width: "24px", height: "24px", cursor: "pointer", fontWeight: "bold" }}
                    disabled={isUploading}
                    title="Batal Upload"
                  >
                    X
                  </button>
                  <a href={f.preview} target="_blank" rel="noreferrer" style={{ position: "absolute", bottom: "5px", right: "5px", background: "rgba(0,0,0,0.5)", color: "white", padding: "2px 5px", fontSize: "12px", textDecoration: "none", borderRadius: "4px" }}>Perbesar</a>
                </div>
              ))}
            </div>

            <button 
              onClick={handleUpload} 
              disabled={isUploading}
              style={{ padding: "12px 24px", backgroundColor: isUploading ? "#ccc" : "#00bfa5", color: "white", border: "none", borderRadius: "4px", fontSize: "16px", cursor: isUploading ? "not-allowed" : "pointer", fontWeight: "bold", width: "100%" }}
            >
              {isUploading ? "Sedang Mengupload..." : "Upload to Gallery"}
            </button>
            {progress && <p style={{ marginTop: "15px", textAlign: "center", fontWeight: "bold", color: "white", background: "#333", padding: "10px", borderRadius: "5px" }}>{progress}</p>}
          </div>
        )}
      </div>
    </>
  );
};

export default AdminPage;
