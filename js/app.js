// Tab Switching System
function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    const activeTab = document.getElementById(`tab-${tabId}`);
    if (activeTab) {
        activeTab.classList.add('active');
    }

    // Update Desktop Nav Styling
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('text-indigo-800', 'dark:text-indigo-400', 'font-semibold');
    });
    
    const activeBtn = document.getElementById(`nav-${tabId}`);
    if (activeBtn) {
        activeBtn.classList.add('text-indigo-800', 'dark:text-indigo-400', 'font-semibold');
    }
}

// Dark Mode Toggle
function toggleDarkMode() {
    const html = document.documentElement;
    const isDark = html.classList.toggle('dark');
    
    document.getElementById('theme-icon-dark')?.classList.toggle('hidden', !isDark);
    document.getElementById('theme-icon-light')?.classList.toggle('hidden', isDark);
}

// Mobile Menu Toggle
function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    if (menu) menu.classList.toggle('hidden');
}

// Toggle Abstract Text
function toggleAbstract(id) {
    const el = document.getElementById(id);
    if (el) el.classList.toggle('hidden');
}

// // Publication Filter
// function filterPubs(category) {
//     const cards = document.querySelectorAll('.pub-card');
//     cards.forEach(card => {
//         if (category === 'all' || card.dataset.category === category) {
//             card.style.display = 'block';
//         } else {
//             card.style.display = 'none';
//         }
//     });

//     document.querySelectorAll('.pub-filter-btn').forEach(btn => {
//         if (btn.dataset.filter === category) {
//             btn.className = 'pub-filter-btn px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 shadow-sm text-slate-900 dark:text-white font-medium';
//         } else {
//             btn.className = 'pub-filter-btn px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium';
//         }
//     });

//     // // 2. Helper to sync button active/inactive states across selector classes
//     // const updateButtonStyles = (selector) => {
//     //     document.querySelectorAll(selector).forEach(btn => {
//     //         if (btn.dataset.filter === category) {
//     //             btn.className = `${selector.replace('.', '')} px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 shadow-sm text-slate-900 dark:text-white font-medium`;
//     //         } else {
//     //             btn.className = `${selector.replace('.', '')} px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium`;
//     //         }
//     //     });
//     // };

//     // // 3. Apply state updates to both filter bar instances
//     // updateButtonStyles('.pub-filter-btn');
//     // updateButtonStyles('.pub-filter-btn2');
// }


// // Activities Filter
// function filterPubs2(category) {

//     const cards2 = document.querySelectorAll('.pub-card2');
//     cards2.forEach(card => {
//         if (category === 'all' || card.dataset.category === category) {
//             card.style.display = 'block';
//         } else {
//             card.style.display = 'none';
//         }
//     });

//         document.querySelectorAll('.pub-filter-btn2').forEach(btn => {
//         if (btn.dataset.filter === category) {
//             btn.className = 'pub-filter-btn2 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 shadow-sm text-slate-900 dark:text-white font-medium';
//         } else {
//             btn.className = 'pub-filter-btn2 px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium';
//         }
//     });

// }

// Project Search
function filterProjects() {
    const query = document.getElementById('project-search')?.value.toLowerCase() || '';
    const cards = document.querySelectorAll('.project-card');

    cards.forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(query) ? 'block' : 'none';
    });
}






/**
 * Generic Dynamic Content Filter Factory
 * @param {string} cardSelector - CSS selector for content cards (e.g., '.pub-card')
 * @param {string} btnSelector  - CSS selector for filter buttons (e.g., '.pub-filter-btn')
 */

function createFilterHandler(cardSelector, btnSelector) {
    return function(category = 'all') {
    // return function(category) {
        // 1. Toggle card visibility
        const cards = document.querySelectorAll(cardSelector);
        cards.forEach(card => {
            if (category === 'all' || card.dataset.category === category) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });


        const buttons = document.querySelectorAll(btnSelector);
        buttons.forEach(btn => {
        // document.querySelectorAll(btnSelector).forEach(btn => {
            if (btn.dataset.filter === category) {
                btn.className = `${btnSelector.replace('.', '')} px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 shadow-sm text-slate-900 dark:text-white font-medium`;
            } else {
                btn.className = `${btnSelector.replace('.', '')} px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium`;
            }
        });
    };
}

// Instantiate specific filter functions using the factory
const filterPubs = createFilterHandler('.pub-card', '.pub-filter-btn');
const filterPubs2 = createFilterHandler('.pub-card2', '.pub-filter-btn2');

// Universal reset function to activate both page filters back to 'all'
function resetAllFilters() {
    filterPubs('all');
    filterPubs2('all');
}


const NOTES_KEY = 'notes_unlocked_until';
let lockTimer = null; // Store timer reference

// Run check when page loads
// document.addEventListener('DOMContentLoaded', checkLockState);

document.addEventListener('DOMContentLoaded', () => {
    checkLockState();
});


function checkLockState() {
    const lockScreen = document.getElementById('notes-lock');
    const content = document.getElementById('notes-content');
    const expiryStr = localStorage.getItem(NOTES_KEY);

    if (expiryStr) {
        const expiry = parseInt(expiryStr, 10);
        const now = Date.now();
        const remainingTime = expiry - now;

        if (remainingTime > 0) {
            // Unlocked & still valid -> Show content
            lockScreen?.classList.add('hidden');
            content?.classList.remove('hidden');

            // Set real-time timer to lock automatically when time runs out
            clearTimeout(lockTimer);
            lockTimer = setTimeout(relockNotes, remainingTime);
            return;
        }
    }

    // Expired or no session saved -> Keep/Make locked
    relockNotes();
}

// Protected Notes Unlock Simulation
function unlockNotes(event) {
    event.preventDefault();
    const passInput = document.getElementById('notes-pass');
    const pass = passInput?.value;
    // const pass = document.getElementById('notes-pass')?.value;
    const lockScreen = document.getElementById('notes-lock');
    const content = document.getElementById('notes-content');
    const lockButton = document.getElementById('lock-button');

    if (pass === 'open-sesame' || pass === 'secret') {
        // --- TIMEOUT DURATION (change 5 * 1000 to 30 * 60 * 1000 for 30 min) ---
        const timeoutDuration = 5 * 1000 // 30 * 60 * 1000; 
        const expiryTime = Date.now() + timeoutDuration;

        localStorage.setItem(NOTES_KEY, expiryTime.toString());

        // Update UI & set real-time auto-lock timer
        checkLockState();
        
        if (passInput) passInput.value = '';

        lockScreen?.classList.add('hidden');
        content?.classList.remove('hidden');
        lockButton?.classList.remove('hidden');
    } else {
        alert('Incorrect Password! It is actually not that "secret"');
        if (passInput) {
            passInput.value = ''; // Clears the entered input
            passInput.focus();    // Refocuses the input field for convenient retry
        }
    }
}

// Optional helper to manually lock notes early
function relockNotes() {
    localStorage.removeItem(NOTES_KEY);
    document.getElementById('notes-lock')?.classList.remove('hidden');
    document.getElementById('notes-content')?.classList.add('hidden');
    document.getElementById('lock-button')?.classList.add('hidden');
    const passInput = document.getElementById('notes-pass');
    passInput.value = ''; // Clears the entered input
    passInput.focus();    // Refocuses the input field for convenient retry
}

// Modal BibTeX functionality
const sampleBibtex = {
    'bib-sigprimednet': `@article{gundogdu2023sigprimednet,\n  title={SigPrimedNet: a signaling-informed neural network for scRNA-seq annotation of known and unknown cell types},\n  author={Gundogdu, Pelin and Alamo, Inmaculada and Nepomuceno-Chamorro, Isabel A and Dopazo, Joaquin and Loucera, Carlos},\n  journal={Biology},\n  volume={12},\n  number={4},\n  pages={579},\n  year={2023},\n  publisher={MDPI}\n}`,
    'bib-integrated': `@article{gundogdu2022integrating,\n  title={Integrating pathway knowledge with deep neural networks to reduce the dimensionality in single-cell RNA-seq data},\n  author={Gundogdu, Pelin and Loucera, Carlos and Alamo-Alvarez, Inmaculada and Dopazo, Joaquin and Nepomuceno, Isabel},\n  journal={BioData Mining},\n  volume={15},\n  number={1},\n  pages={1},\n  year={2022},\n  publisher={Springer}\n}`,
    'bib-ivae':`@inproceedings{gundogdu2023cell,\n  title={Cell-Level Pathway Scoring Comparison with a Biologically Constrained Variational Autoencoder},\n  author={Gundogdu, Pelin and Pay{\'a}-Milans, Miriam and Alamo-Alvarez, Inmaculada and Nepomuceno-Chamorro, Isabel A and Dopazo, Joaquin and Loucera, Carlos},\n  booktitle={International Conference on Computational Methods in Systems Biology},\n  pages={62--77},\n  year={2023},\n  organization={Springer}\n}`,
    'bib-con0':`@article{gabor2021cell,\n  title={Cell-to-cell and type-to-type heterogeneity of signaling networks: insights from the crowd},\n  author={Gabor, Attila and Tognetti, Marco and Driessen, Alice and Tanevski, Jovan and Guo, Baosen and Cao, Wencai and Shen, He and Yu, Thomas and Chung, Verena and Single Cell Signaling in Breast Cancer DREAM Consortium members and others},\n  journal={Molecular systems biology},\n  volume={17},\n  number={10},\n  pages={MSB202110402},\n  year={2021},\n  publisher={Springer}\n}`
    };

function openBibtexModal(bibId) {
    const modal = document.getElementById('bibtex-modal');
    const container = document.getElementById('bibtex-content');
    if (modal && container) {
        container.textContent = sampleBibtex[bibId] || '@article{empty,...}';
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
}

function closeBibtexModal() {
    const modal = document.getElementById('bibtex-modal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

// function copyBibtex() {
//     const text = document.getElementById('bibtex-content')?.textContent;
//     if (text) {
//         navigator.clipboard.writeText(text);
//         // alert('BibTeX copied to clipboard!');
//     }
// }

function copyBibtex(button) {
    // 1. Copy text to clipboard
    const content = document.getElementById('bibtex-content').innerText;
    navigator.clipboard.writeText(content);

    // 2. Disable button to prevent clicks
    button.disabled = true;

    // 3. Update styling to green & change text/icon
    button.classList.remove('bg-indigo-600', 'hover:bg-indigo-500');
    button.classList.add('bg-emerald-600'); //hover:bg-emerald-500
    button.innerHTML = '<i data-lucide="check" class="w-4 h-4"></i> <span>Copied!</span>';
    
    // Refresh Lucide icon if using Lucide
    if (window.lucide) lucide.createIcons();

    // 4. Re-enable button after 3000ms (3 seconds)
    setTimeout(() => {
      button.classList.remove('bg-emerald-600'); //hover:bg-emerald-500
      button.classList.add('bg-indigo-600', 'hover:bg-indigo-500');
      button.innerHTML = '<i data-lucide="copy" class="w-4 h-4"></i> <span>Copy Citation</span>';
      
      if (window.lucide) lucide.createIcons();
    //   button.dataset.active = "false";
    button.disabled = false; // Re-enable clicks
    }, 3000);
  }