# 🎬 Video Background — Setup Instructions

Put your fire/atmospheric MP4 video file here as `fire-background.mp4`

---

## 📁 Required Files

| File | Description | Required? |
|---|---|---|
| `fire-background.mp4` | Main video (looping fire/smoke) | ✅ Yes |
| `fire-poster.jpg` | First frame image (shown while video loads) | Optional but recommended |
| `fire-background.webm` | WebM version (better compression) | Optional |

---

## 🔍 Where to Find Free Fire Videos

### **Best free sources (no attribution needed):**

1. **Pexels** — https://www.pexels.com/search/videos/fire/
2. **Pixabay** — https://pixabay.com/videos/search/fire/
3. **Coverr** — https://coverr.co/s/fire
4. **Mixkit** — https://mixkit.co/free-stock-video/fire/

### **Recommended search terms:**
- "fire flames black background"
- "smoke particles dark"
- "embers floating loop"
- "fire texture seamless"
- "burning particles slow motion"

---

## 📐 Recommended Specifications

| Property | Recommended Value | Why |
|---|---|---|
| **Format** | MP4 (H.264) | Universal browser support |
| **Resolution** | 1920×1080 (Full HD) | Sharp on big screens, scales down |
| **Duration** | 8-15 seconds | Loops seamlessly |
| **File size** | < 5 MB | Fast loading |
| **Audio** | None / Removed | Auto-play needs to be muted |
| **Aspect ratio** | 16:9 | Wide screens |
| **Background** | Pure black or very dark | Blends with your dark theme |

---

## 🔧 Optimize Your Video

Got a large video? Compress it for faster loading:

### **Option 1: Online (easiest)**
- https://www.veed.io/tools/video-compressor
- https://clipchamp.com/en/video-compressor/
- https://www.freeconvert.com/video-compressor

### **Option 2: HandBrake (free desktop app)**
- Download: https://handbrake.fr
- Settings:
  - Preset: **"Web → Vimeo YouTube HQ 1080p60"**
  - Encoder: **H.264**
  - Quality: RF 24-26
  - Audio: **None / Remove**

### **Option 3: FFmpeg (command line)**
```bash
ffmpeg -i input.mp4 -c:v libx264 -crf 26 -preset slow -an -movflags +faststart -vf scale=1920:-2 fire-background.mp4
```

---

## 🎨 Generate Poster Image

The poster image shows while video is loading. To extract from your MP4:

### **Option 1: VLC Player**
1. Open video in VLC
2. Pause at a good frame
3. **Video → Take Snapshot**
4. Save as `fire-poster.jpg`

### **Option 2: FFmpeg**
```bash
ffmpeg -i fire-background.mp4 -ss 00:00:02 -frames:v 1 fire-poster.jpg
```

### **Option 3: Online**
- https://imageresizer.com/
- Upload video → extract frame

---

## ✅ Final Folder Structure

```
public/
└── videos/
    ├── fire-background.mp4    ← Your main video
    ├── fire-poster.jpg        ← Loading image
    └── fire-background.webm   ← Optional: smaller alternative
```

---

## 🎯 Test Your Video

After placing files:

1. Stop dev server: `Ctrl + C`
2. Restart: `npm run dev`
3. Open: `http://localhost:3000`
4. Should see your fire video looping behind everything ✅

---

## 🔧 Customize the Effect

In `src/app/layout.tsx`, find the `<VideoBackground>` component and adjust:

```tsx
<VideoBackground
  src="/videos/fire-background.mp4"     // Your video path
  poster="/videos/fire-poster.jpg"      // Loading image
  opacity={0.5}                         // 0.3 = subtle, 0.7 = vivid
  position="full"                       // 'full' | 'bottom' | 'top'
  blendMode="screen"                    // 'screen' | 'lighten' | 'overlay'
  disableOnMobile={false}               // true = mobile shows gradient instead
/>
```

### **Position options:**
- **`full`** — Video covers entire screen behind content
- **`bottom`** — Only bottom 60% (good for fire pillar effect)
- **`top`** — Only top 50% (cinematic header)

### **Blend mode tips:**
- **`screen`** — Brightens dark backgrounds (best for fire)
- **`lighten`** — Even brighter blending
- **`overlay`** — Mix with content (artistic)
- **`normal`** — No blending (just plays as-is)

---

*Once you place the files and restart, your video will play across the entire site! 🔥🎬*
