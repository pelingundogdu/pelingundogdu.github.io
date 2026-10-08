document.addEventListener("DOMContentLoaded", async () => {
    const components = [
        { id: "header-slot", file: "components/header.html" },
        { id: "about-slot", file: "components/about.html" },
        { id: "publications-slot", file: "components/publications.html" },
        { id: "activities-slot", file: "components/activities.html" },
        { id: "projects-slot", file: "components/projects.html" },
        { id: "notes-slot", file: "components/notes.html" },
        // { id: "teaching-slot", file: "components/teaching.html" }
    ];

    await Promise.all(
        components.map(async (comp) => {
            try {
                const res = await fetch(comp.file);
                if (res.ok) {
                    const html = await res.text();
                    document.getElementById(comp.id).innerHTML = html;
                } else {
                    console.error(`Failed to load component: ${comp.file}`);
                }
            } catch (err) {
                console.error(`Error fetching ${comp.file}:`, err);
            }
        })
    );

    // Initialize Lucide icons after all DOM components are loaded
    if (window.lucide) {
        lucide.createIcons();
    }
});