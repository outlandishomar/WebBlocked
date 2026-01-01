// ==UserScript==
// @name         WebBlocked
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Blocks specific sites of your choose
// @author       outlandishomar
// @match        *://*/*
// @updateURL    https://raw.githubusercontent.com/outlandishomar/WebBlocked/main/Web%20Blocked.user.js
// @downloadURL  https://raw.githubusercontent.com/outlandishomar/WebBlocked/main/Web%20Blocked.user.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // --- CONFIGURATION DEFAULTS ---
    const DEFAULT_MSG = "";
    const DEFAULT_BLOCKED = [];

    const LINKS = {
        insta: "https://www.instagram.com/outlandishomar/",
        github: "https://github.com/outlandishomar",
        discordUser: "outlandishomar"
    };

    // --- CHECK CURRENT URL ---
    const currentHost = window.location.hostname;
    const storedBlocklist = GM_getValue('blockList', DEFAULT_BLOCKED);
    const userMessage = GM_getValue('blockMessage', DEFAULT_MSG);
    const hasConfigured = GM_getValue('hasConfigured', false);

    // Helper to check if current site is in blocklist
    const isBlocked = storedBlocklist.some(domain => {
        return domain.trim().length > 0 && currentHost.includes(domain);
    });

    // --- MAIN LOGIC ---

    if (isBlocked) {
        window.stop();
        document.documentElement.innerHTML = '';

        // Fallback message if empty
        const displayMsg = userMessage.trim() === "" ? "get your ass off" : userMessage;

        document.head.innerHTML = `
            <meta charset="UTF-8">
            <title>BLOCKED</title>
            <style>
                body {
                    margin: 0;
                    padding: 0;
                    background-color: #050505;
                    color: #e0e0e0;
                    height: 100vh;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    font-family: 'Consolas', 'Monaco', 'Lucida Console', monospace;
                    overflow: hidden;
                    user-select: none;
                }
                .content { text-align: center; z-index: 2; }
                h1 {
                    font-size: 4rem;
                    font-weight: bold;
                    text-transform: uppercase;
                    letter-spacing: 5px;
                    line-height: 1.2;
                    color: #ff3333;
                    text-shadow: 0px 0px 25px rgba(255, 0, 0, 0.6);
                    animation: pulse 3s infinite ease-in-out;
                }
                .settings-trigger {
                    position: absolute; top: 25px; right: 30px;
                    background: transparent; border: none; color: #444; 
                    cursor: pointer; transition: color 0.3s, transform 0.7s ease;
                    z-index: 10; padding: 0;
                }
                .settings-trigger:hover { color: #888; transform: rotate(180deg); }
                .settings-icon-svg { width: 28px; height: 28px; fill: currentColor; }
                .footer {
                    position: absolute; bottom: 30px; width: 90%;
                    display: flex; justify-content: space-between; align-items: center;
                    font-size: 0.9rem; color: #555; font-family: 'Consolas', monospace;
                }
                .footer-left { opacity: 0.7; }
                .footer-right { display: flex; gap: 20px; align-items: center; }
                .social-item {
                    color: #555; text-decoration: none; display: flex; align-items: center;
                    justify-content: center; transition: all 0.3s ease; cursor: pointer;
                    background: transparent; border: none; padding: 0;
                }
                .social-icon { width: 20px; height: 20px; fill: currentColor; }
                .social-item.insta:hover { color: #E1306C; transform: scale(1.1); }    
                .social-item.github:hover { color: #ffffff; transform: scale(1.1); }    
                .social-item.discord:hover { color: #5865F2; transform: scale(1.1); }   

                @keyframes pulse {
                    0% { opacity: 0.8; text-shadow: 0 0 10px rgba(255,0,0,0.5); }
                    50% { opacity: 1; text-shadow: 0 0 40px rgba(255,0,0,0.8); }
                    100% { opacity: 0.8; text-shadow: 0 0 10px rgba(255,0,0,0.5); }
                }
            </style>
        `;

        const icons = {
            settings: `<svg class="settings-icon-svg" viewBox="0 0 24 24"><path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/></svg>`,
            insta: `<svg class="social-icon" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>`,
            github: `<svg class="social-icon" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>`,
            discord: `<svg class="social-icon" viewBox="0 0 24 24"><path d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09c-.01-.02-.04-.03-.07-.03c-1.5.26-2.93.71-4.27 1.33c-.01 0-.02.01-.03.02c-2.72 4.07-3.47 8.03-3.1 11.95c0 .02.01.04.03.05c1.8 1.32 3.53 2.12 5.24 2.65c.03.01.06 0 .07-.02c.4-.55.76-1.13 1.07-1.74c.02-.04 0-.08-.04-.09c-.57-.22-1.11-.48-1.64-.78c-.04-.02-.04-.08.01-.11c.11-.08.22-.17.33-.25c.02-.02.05-.02.07-.01c3.44 1.57 7.15 1.57 10.55 0c.02-.01.05-.01.07.01c.11.09.22.17.33.26c.04.03.04.09-.01.11c-.52.31-1.07.56-1.64.78c-.04.01-.05.06-.04.09c.32.61.68 1.19 1.07 1.74c.03.01.06.02.09.01c1.72-.53 3.45-1.33 5.25-2.65c.02-.01.03-.03.03-.05c.44-4.53-.73-8.46-3.1-11.95c-.01-.01-.02-.02-.04-.02zM8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.84 2.12-1.89 2.12zm6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.85 2.12-1.89 2.12z"/></svg>`
        };

        document.body.innerHTML = `
            <button id="openSettings" class="settings-trigger" title="Configure">
                ${icons.settings}
            </button>
            <div class="content"><h1>${displayMsg.replace(/\n/g, '<br>')}</h1></div>
            <div class="footer">
                <div class="footer-left">made by outlandishomar</div>
                <div class="footer-right">
                    <a href="${LINKS.insta}" target="_blank" class="social-item insta" title="Instagram">${icons.insta}</a>
                    <a href="${LINKS.github}" target="_blank" class="social-item github" title="GitHub">${icons.github}</a>
                    <div id="discordBtn" class="social-item discord" title="Copy Discord User">${icons.discord}</div>
                </div>
            </div>
        `;

        document.getElementById('openSettings').addEventListener('click', createSettingsUI);
        document.getElementById('discordBtn').addEventListener('click', () => {
            navigator.clipboard.writeText(LINKS.discordUser).then(() => {
                alert('COPIED DISCORD USER: ' + LINKS.discordUser);
            }).catch(err => console.error(err));
        });

    } else {
        GM_registerMenuCommand("⚙️ Open Blocker Settings", createSettingsUI);
        if (!hasConfigured) {
            const runSettings = () => createSettingsUI();
            if (document.readyState === "complete" || document.readyState === "interactive") runSettings();
            else window.addEventListener('load', runSettings);
        }
    }

    // --- UI FUNCTIONS ---

    function createSettingsUI() {
        if (document.getElementById('blocker-settings-modal')) return;

        const modal = document.createElement('div');
        modal.id = 'blocker-settings-modal';
        
        const shieldSVG = `
        <svg class="shield-icon" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/></svg>`;

        // Construct HTML for UI
        modal.innerHTML = `
            <div class="modal-content">
                <div class="header">
                    ${shieldSVG}
                    <h2>Web Blocked</h2>
                </div>
                
                <div class="input-group">
                    <label style="text-align: center;">Warning Message</label>
                    <textarea id="msgInput" rows="2" placeholder="get your ass off">${GM_getValue('blockMessage', DEFAULT_MSG)}</textarea>
                </div>
                
                <div class="input-group">
                    <label>Blocked List</label>
                    <div id="sites-container">
                        </div>
                </div>
                
                <div class="buttons">
                    <button id="closeBtn" class="secondary">Cancel</button>
                    <button id="saveBtn">Save & Activate</button>
                </div>
                <div class="ui-footer">made by outlandishomar</div>
            </div>
            <style>
                #blocker-settings-modal {
                    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                    background: rgba(0,0,0,0.85); z-index: 2147483647;
                    display: flex; justify-content: center; align-items: center;
                    font-family: 'Consolas', monospace; backdrop-filter: blur(5px);
                }
                .modal-content {
                    background: #0f0f0f; color: #eee; padding: 0;
                    border-radius: 16px; width: 450px;
                    box-shadow: 0 20px 50px rgba(0,0,0,0.8);
                    border: 1px solid #333; overflow: hidden;
                }
                .header {
                    background: #1a1a1a; padding: 20px; border-bottom: 1px solid #333;
                    display: flex; align-items: center; gap: 10px;
                }
                h2 { margin: 0; color: #4CAF50; font-size: 1.2rem; font-weight: bold; letter-spacing: 1px; }
                .shield-icon { width: 24px; height: 24px; fill: #4CAF50; animation: shine 3s infinite ease-in-out; }
                @keyframes shine {
                    0% { filter: drop-shadow(0 0 2px rgba(76, 175, 80, 0.5)); opacity: 0.8; }
                    50% { filter: drop-shadow(0 0 10px rgba(76, 175, 80, 1)); opacity: 1; }
                    100% { filter: drop-shadow(0 0 2px rgba(76, 175, 80, 0.5)); opacity: 0.8; }
                }

                .input-group { padding: 20px 20px 0 20px; }
                label { display: block; margin-bottom: 10px; font-size: 0.8rem; color: #888; text-transform: uppercase; font-weight: bold; }
                
                #msgInput {
                    width: 100%; background: #000; border: 1px solid #333;
                    color: #00ff00; padding: 10px; border-radius: 6px;
                    box-sizing: border-box; resize: none; outline: none;
                    font-family: 'Consolas', monospace; font-size: 0.9rem;
                }
                #msgInput:focus { border-color: #4CAF50; }

                /* Site Row Styling */
                #sites-container {
                    max-height: 250px; overflow-y: auto; padding-right: 5px;
                    display: flex; flex-direction: column; gap: 8px;
                }
                .site-row { display: flex; align-items: center; gap: 8px; }
                .site-num { color: #555; font-size: 0.8rem; min-width: 20px; text-align: right; }
                .site-input {
                    flex-grow: 1; background: #1a1a1a; border: 1px solid #333;
                    color: #ccc; padding: 10px; border-radius: 6px; outline: none;
                    font-family: 'Consolas', monospace; font-size: 0.9rem;
                }
                .site-input:focus { border-color: #4CAF50; color: #fff; background: #000; }
                .remove-btn {
                    background: #1a1a1a; border: 1px solid #333; color: #666;
                    width: 36px; height: 36px; border-radius: 6px; cursor: pointer;
                    display: flex; align-items: center; justify-content: center; font-weight: bold;
                }
                .remove-btn:hover { border-color: #ff3333; color: #ff3333; background: #000; }

                .buttons { padding: 20px; display: flex; gap: 10px; justify-content: flex-end; background: #1a1a1a; border-top: 1px solid #333; margin-top: 20px; }
                button {
                    padding: 12px 24px; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; font-family: 'Consolas', monospace; transition: all 0.2s;
                }
                #saveBtn { background: #4CAF50; color: #000; }
                #saveBtn:hover { background: #45a049; transform: translateY(-1px); }
                .secondary { background: transparent; color: #666; }
                .secondary:hover { color: #fff; }
                
                .ui-footer { text-align: center; padding-bottom: 10px; font-size: 0.7rem; color: #333; background: #1a1a1a; }
                
                /* Scrollbar */
                ::-webkit-scrollbar { width: 6px; }
                ::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
                ::-webkit-scrollbar-thumb:hover { background: #555; }
            </style>
        `;

        document.body.appendChild(modal);
        
        const container = document.getElementById('sites-container');
        
        // Load initial sites
        let currentSites = GM_getValue('blockList', DEFAULT_BLOCKED);
        if (currentSites.length === 0) currentSites = [""];
        else currentSites.push(""); // Add empty slot at end

        // Render Function
        function renderRows() {
            container.innerHTML = '';
            currentSites.forEach((site, index) => {
                const row = document.createElement('div');
                row.className = 'site-row';
                
                // Number
                const num = document.createElement('span');
                num.className = 'site-num';
                num.innerText = index + 1 + '.';
                
                // Input
                const input = document.createElement('input');
                input.className = 'site-input';
                input.value = site;
                
                // Placeholder Logic: 
                // Row 0 (First one) -> "example.com"
                // Row 1+ (Subsequent) -> "Add new site..."
                if (index === 0) {
                    input.placeholder = "example.com";
                } else {
                    input.placeholder = "Add new site...";
                }
                
                input.spellcheck = false;
                
                // Update array on type
                input.addEventListener('input', (e) => {
                    currentSites[index] = e.target.value;
                });

                // Enter Key -> Add New Row
                input.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        
                        // If we are at the last item, add a new one
                        if (index === currentSites.length - 1) {
                            currentSites.push("");
                            renderRows();
                            // Focus new input
                            const inputs = container.querySelectorAll('.site-input');
                            if (inputs[index + 1]) inputs[index + 1].focus();
                        } else {
                            // Just move focus down
                            const inputs = container.querySelectorAll('.site-input');
                            if (inputs[index + 1]) inputs[index + 1].focus();
                        }
                    }
                });

                // Remove Button
                const btn = document.createElement('button');
                btn.className = 'remove-btn';
                btn.innerHTML = '✕';
                btn.onclick = () => {
                    currentSites.splice(index, 1);
                    if(currentSites.length === 0) currentSites.push("");
                    renderRows();
                };

                row.appendChild(num);
                row.appendChild(input);
                row.appendChild(btn);
                container.appendChild(row);
            });
        }

        renderRows();

        // Save Logic
        document.getElementById('saveBtn').onclick = function() {
            const newMsg = document.getElementById('msgInput').value;
            const finalBlocklist = currentSites.map(s => s.trim()).filter(s => s.length > 0);

            GM_setValue('blockMessage', newMsg);
            GM_setValue('blockList', finalBlocklist);
            GM_setValue('hasConfigured', true);

            alert('SHIELD UPDATED. REFRESHING...');
            modal.remove();
            window.location.reload();
        };

        document.getElementById('closeBtn').onclick = function() {
            modal.remove();
        };
    }

})();
