# WAKE UP HUMANITY

Eine minimale, statische Website für bewusstseinserweiternde Inhalte.

## 📋 Was ist das?

Eine responsive Website mit Artikeln über Bewusstsein, Meditation und die Programmierung des Menschen. **Vollständig ohne Abhängigkeiten** – nur HTML, CSS und JavaScript.

## 🚀 Wie man es nutzt

### Lokal
1. Einfach die Dateien herunterladen
2. `index.html` im Browser öffnen
3. Fertig! Keine Installation, kein Build-Prozess nötig

### Auf GitHub hosten
GitHub bietet kostenloses Hosting mit GitHub Pages:

1. **Repository erstellen** auf github.com
2. **Dateien hochladen** (alle Dateien und Ordner)
3. Einstellungen → Pages → Branch wählen (z.B. `main`)
4. Website ist live unter `https://deinname.github.io/repo-name`

## 📁 Struktur

```
.
├── index.html              # Startseite
├── articles/              # Artikel als HTML
│   └── programmierung-des-menschen.html
├── content/               # Quelltext (nicht mehr nötig)
└── scripts/               # Alte Build-Skripte (nicht mehr nötig)
```

## ✨ Features

- ✅ Keine Node.js, npm oder Build-Tools nötig
- ✅ Funktioniert überall (Browser, GitHub Pages, beliebiger Webserver)
- ✅ Responsive Design
- ✅ Schnell und einfach

## 📝 Neue Artikel hinzufügen

1. Neue `.html`-Datei in `articles/` erstellen
2. Das Template aus `articles/programmierung-des-menschen.html` verwenden
3. Link in `index.html` hinzufügen

## 🔧 Alte Build-Pipeline

Das ursprüngliche `generate-articles.js` ist nicht mehr nötig. Die HTML-Artikel sind bereits generiert und einsatzbereit.

Falls du dennoch .txt-Dateien zu HTML konvertieren möchtest, benötigst du Node.js:
```bash
node scripts/generate-articles.js
```

---

**Viel Spaß mit der Website! 🌟**
