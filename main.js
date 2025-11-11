// Configuration object for Element SDK
const defaultConfig = {
    company_name: "PT. JAYA KENCANA",
    copyright_text: "Copyright 2025 PT. Jaya Kencana"
};

// Global variables
let currentUser = null;
let currentUserType = 'user';
let currentSection = null;
let formData = [];
let itemCounter = 0;
let workCounter = 0;

// User data configuration
const userData = {
    // 'user1': {
    //     technicians: ['Teknisi A', 'Teknisi B', 'Teknisi C'],
    //     buildings: ['Gedung Plaza 1', 'Gedung Plaza 2', 'Mall Central']
    // },
    'a': {
        technicians: ['Teknisi A', 'Teknisi B', 'Teknisi C'],
        buildings: ['Gedung Plaza 1', 'Gedung Plaza 2', 'Mall Central']
    },
    'user2': {
        technicians: ['Teknisi D', 'Teknisi E'],
        buildings: ['Tower Office', 'Apartment Sky']
    },
    'admin1': {
        technicians: ['Admin Tech 1', 'Admin Tech 2'],
        buildings: ['All Buildings']
    }
};

// Dropdown options
const dropdownOptions = {
    buildings: ['Gedung Plaza 1', 'Gedung Plaza 2', 'Mall Central', 'Tower Office', 'Apartment Sky'],
    spareparts: ['Motor', 'Brake', 'Cable', 'Control Panel', 'Sensor', 'Button'],
    conditions: ['Baik', 'Rusak Ringan', 'Rusak Berat', 'Perlu Penggantian'],
    quantities: ['1', '2', '3', '4', '5', '10', '20'],
    units: ['Pcs', 'Set', 'Meter', 'Roll', 'Box'],
    remarks: ['Urgent', 'Normal', 'Low Priority', 'Scheduled'],
    priorities: ['High', 'Medium', 'Low'],
    additionalWork: ['Pembersihan', 'Pelumasan', 'Kalibrasi', 'Inspeksi', 'Perbaikan'],
    workConditions: ['Selesai', 'Dalam Proses', 'Tertunda', 'Perlu Review'],
    workRemarks: ['Sesuai Jadwal', 'Terlambat', 'Dipercepat', 'Perlu Koordinasi']
};

// Sparepart to unit mapping
const sparepartUnitMapping = {
    'Cable': 'Meter',
    'Motor': 'Unit',
    'Control Panel': 'Unit',
    'Brake': 'Unit',
    'Sensor': 'Pcs',
    'Button': 'Pcs'
};

// Data handler for SDK
const dataHandler = {
    onDataChanged(data) {
        formData = data;
        if (currentSection === 'history') {
            renderHistory();
        }
    }
};

// Initialize Element SDK
async function initializeElementSDK() {
    if (window.elementSdk) {
        await window.elementSdk.init({
            defaultConfig: defaultConfig,
            onConfigChange: async (config) => {
                const companyTitle = document.getElementById('companyTitle');
                const mainCompanyTitle = document.getElementById('mainCompanyTitle');
                const copyrightText = document.getElementById('copyrightText');

                if (companyTitle) companyTitle.textContent = config.company_name || defaultConfig.company_name;
                if (mainCompanyTitle) mainCompanyTitle.textContent = config.company_name || defaultConfig.company_name;
                if (copyrightText) copyrightText.textContent = config.copyright_text || defaultConfig.copyright_text;
            },
            mapToCapabilities: (config) => ({
                recolorables: [],
                borderables: [],
                fontEditable: undefined,
                fontSizeable: undefined
            }),
            mapToEditPanelValues: (config) => new Map([
                ["company_name", config.company_name || defaultConfig.company_name],
                ["copyright_text", config.copyright_text || defaultConfig.copyright_text]
            ])
        });
    }
}

// Initialize Data SDK
async function initializeDataSDK() {
    if (window.dataSdk) {
        const result = await window.dataSdk.init(dataHandler);
        if (!result.isOk) {
            console.error("Failed to initialize data SDK");
        }
    }
}

// Initialize application
async function initializeApp() {
    await initializeElementSDK();
    await initializeDataSDK();
    setupEventListeners();
}

// Setup event listeners
function setupEventListeners() {
    // Login form
    document.getElementById('loginForm').addEventListener('submit', handleLogin);

    // Navigation
    document.querySelectorAll('.nav-card').forEach(card => {
        card.addEventListener('click', function () {
            const section = this.dataset.section;
            navigateToSection(section);
        });
    });
}

// Handle login
function handleLogin(e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Validate credentials
    if ((username === 'user1' && password === '123') ||
        (username === 'admin' && password === 'admin123')) {

        currentUser = username;
        currentUserType = username === 'admin' ? 'admin' : 'user';

        // Update user subtitle
        const userSubtitle = document.getElementById('userSubtitle');
        userSubtitle.textContent = `Selamat datang, ${username.toUpperCase()}`;

        // Show main screen
        document.getElementById('loginScreen').classList.add('hidden');
        document.getElementById('mainScreen').classList.remove('hidden');

        // Show navigation initially
        document.querySelector('.navigation-grid').style.display = 'grid';
    } else {
        showMessage("Username atau password salah!", "error");
    }
}

// Logout function
function logout() {
    currentUser = null;
    currentUserType = 'user';
    currentSection = null;

    // Reset form
    document.getElementById('loginForm').reset();

    // Reset navigation
    document.querySelector('.navigation-grid').style.display = 'grid';
    document.getElementById('contentArea').innerHTML = '';
    document.querySelectorAll('.nav-card').forEach(card => {
        card.classList.remove('active');
    });

    // Show login screen
    document.getElementById('mainScreen').classList.add('hidden');
    document.getElementById('loginScreen').classList.remove('hidden');
}

// Navigate to section
function navigateToSection(section) {
    currentSection = section;

    // Hide navigation and show content
    document.querySelector('.navigation-grid').style.display = 'none';

    // Update navigation active state
    document.querySelectorAll('.nav-card').forEach(card => {
        card.classList.remove('active');
    });
    document.querySelector(`[data-section="${section}"]`).classList.add('active');

    // Reset counters when navigating
    itemCounter = 0;
    workCounter = 0;

    // Render content
    const contentArea = document.getElementById('contentArea');

    switch (section) {
        case 'escalator':
        case 'elevator':
            renderFormSection(section);
            break;
        case 'history':
            renderHistorySection();
            break;
    }
}

// Render form section
function renderFormSection(type) {
    const title = type === 'escalator' ? 'Safety Eskalator' : 'Safety Elevator';
    const contentArea = document.getElementById('contentArea');

    contentArea.innerHTML = `
                <div class="form-section">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                        <h2 class="section-title" style="margin: 0;">${title}</h2>
                        <button type="button" class="btn-small" onclick="backToNavigation()" style="background: rgba(255,255,255,0.1); color: white; border: 1px solid rgba(255,255,255,0.3);">← Kembali</button>
                    </div>
                    
                    <form id="mainForm">
                        <div class="form-row">
                            <div class="form-group">
                                <label for="buildingName" class="form-label">Nama Gedung/Proyek</label>
                                <div class="dropdown-container">
                                    <input type="text" id="buildingName" class="form-input" placeholder="Pilih atau ketik nama gedung" autocomplete="off" required>
                                    <div id="buildingDropdown" class="dropdown-list"></div>
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">Nama Teknisi</label>
                                <div class="checkbox-group" id="technicianCheckboxes">
                                    <!-- Technician checkboxes will be populated here -->
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label for="workDate" class="form-label">Tanggal</label>
                                <input type="date" id="workDate" class="form-input" required>
                            </div>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="headerUnit" class="form-label">Unit</label>
                                <input type="text" id="headerUnit" class="form-input" placeholder="Masukkan unit" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="headerMFG" class="form-label">MFG</label>
                                <input type="text" id="headerMFG" class="form-input" placeholder="Masukkan MFG" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="headerType" class="form-label">Type</label>
                                <input type="text" id="headerType" class="form-input" placeholder="Masukkan type" required>
                            </div>
                        </div>
                        
                        <div class="section-title" style="margin-top: 30px;">ITEM</div>
                        <div id="itemsContainer">
                            <!-- Items will be added here -->
                        </div>
                        
                        <div id="additionalWorkContainer">
                            <!-- Additional work will be added here -->
                        </div>
                        
                        <div style="margin: 30px 0 20px 0;">
                            <button type="button" class="btn-add" onclick="addItem()">+ Tambah Item</button>
                            <button type="button" class="btn-add" onclick="addWork()">+ Tambah Pekerjaan</button>
                        </div>
                        
                        <button type="submit" class="btn-primary">Submit</button>
                        <button id="btnPDF" type="button" class="btn-primary mt-3" onclick="printPdf()">Print PDF</button>
                    </form>
                </div>
            `;

    // Populate technician checkboxes
    populateTechnicianCheckboxes();

    // Setup dropdown for building name
    setupDropdown('buildingName', 'buildingDropdown', getUserBuildings());

    // Setup form submission
    document.getElementById('mainForm').addEventListener('submit', handleFormSubmit);

    // Set current date
    document.getElementById('workDate').valueAsDate = new Date();

    // Add initial item
    addItem();
}

// Populate technician checkboxes
function populateTechnicianCheckboxes() {
    const container = document.getElementById('technicianCheckboxes');
    const technicians = getUserTechnicians();

    container.innerHTML = technicians.map(tech => `
                <div class="checkbox-item">
                    <input type="checkbox" id="tech_${tech}" name="technicians" value="${tech}">
                    <label for="tech_${tech}">${tech}</label>
                </div>
            `).join('');
}

// Get user technicians
function getUserTechnicians() {
    return userData[currentUser] ? userData[currentUser].technicians : ['Teknisi Default'];
}

// Get user buildings
function getUserBuildings() {
    return userData[currentUser] ? userData[currentUser].buildings : dropdownOptions.buildings;
}

// Setup dropdown functionality
function setupDropdown(inputId, dropdownId, options) {
    const input = document.getElementById(inputId);
    const dropdown = document.getElementById(dropdownId);

    input.addEventListener('input', function () {
        const value = this.value.toLowerCase();
        const filtered = options.filter(option =>
            option.toLowerCase().includes(value)
        );

        if (filtered.length > 0 && value) {
            dropdown.innerHTML = filtered.map(option =>
                `<div class="dropdown-item" onclick="selectDropdownItem('${inputId}', '${option}')">${option}</div>`
            ).join('');
            dropdown.style.display = 'block';
        } else {
            dropdown.style.display = 'none';
        }
    });

    input.addEventListener('focus', function () {
        if (options.length > 0) {
            dropdown.innerHTML = options.map(option =>
                `<div class="dropdown-item" onclick="selectDropdownItem('${inputId}', '${option}')">${option}</div>`
            ).join('');
            dropdown.style.display = 'block';
        }
    });

    document.addEventListener('click', function (e) {
        if (!input.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.style.display = 'none';
        }
    });
}

// Select dropdown item
function selectDropdownItem(inputId, value) {
    document.getElementById(inputId).value = value;
    const dropdownId = inputId === 'buildingName' ? 'buildingDropdown' : inputId.replace(/([A-Z])/g, '$1') + 'Dropdown';
    document.getElementById(dropdownId).style.display = 'none';
}

// Add item
function addItem() {
    itemCounter++;
    const container = document.getElementById('itemsContainer');

    const itemHtml = `
                <div class="item-container" id="item_${itemCounter}">
                    <div class="item-header">
                        <span class="item-number">Item ${itemCounter}</span>
                        <div class="item-actions">
                            <button type="button" class="btn-small btn-clear" onclick="clearItem(${itemCounter})">Clear</button>
                            <button type="button" class="btn-small btn-delete" onclick="deleteItem(${itemCounter})">Delete</button>
                        </div>
                    </div>
                    

                    
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Item Sparepart</label>
                            <div class="dropdown-container">
                                <input type="text" class="form-input" name="sparepart_${itemCounter}" placeholder="Pilih sparepart" autocomplete="off">
                                <div class="dropdown-list" id="sparepart_dropdown_${itemCounter}"></div>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Kondisi</label>
                            <div class="dropdown-container">
                                <input type="text" class="form-input" name="condition_${itemCounter}" placeholder="Pilih kondisi" autocomplete="off">
                                <div class="dropdown-list" id="condition_dropdown_${itemCounter}"></div>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Jumlah</label>
                            <div class="dropdown-container">
                                <input type="text" class="form-input" name="quantity_${itemCounter}" placeholder="Pilih jumlah" autocomplete="off">
                                <div class="dropdown-list" id="quantity_dropdown_${itemCounter}"></div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Satuan</label>
                            <div class="dropdown-container">
                                <input type="text" class="form-input" name="unit_type_${itemCounter}" placeholder="Pilih satuan" autocomplete="off">
                                <div class="dropdown-list" id="unit_dropdown_${itemCounter}"></div>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Remarks</label>
                            <div class="dropdown-container">
                                <input type="text" class="form-input" name="remarks_${itemCounter}" placeholder="Pilih remarks" autocomplete="off">
                                <div class="dropdown-list" id="remarks_dropdown_${itemCounter}"></div>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Prioritas</label>
                            <div class="dropdown-container">
                                <input type="text" class="form-input" name="priority_${itemCounter}" placeholder="Pilih prioritas" autocomplete="off">
                                <div class="dropdown-list" id="priority_dropdown_${itemCounter}"></div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Foto Part</label>
                        <div id="photoContainer_${itemCounter}">
                            <div class="photo-upload" onclick="addPhotoUpload(${itemCounter}, 1)">
                                <span>📷 Klik untuk upload foto</span>
                                <input type="file" accept="image/*" style="display: none;" onchange="handlePhotoUpload(this, ${itemCounter}, 1)">
                            </div>
                        </div>
                    </div>
                </div>
            `;

    container.insertAdjacentHTML('beforeend', itemHtml);

    // Setup dropdowns for this item
    setupItemDropdowns(itemCounter);
}

// Setup dropdowns for item
function setupItemDropdowns(itemId) {
    const dropdowns = [
        { input: `sparepart_${itemId}`, dropdown: `sparepart_dropdown_${itemId}`, options: dropdownOptions.spareparts },
        { input: `condition_${itemId}`, dropdown: `condition_dropdown_${itemId}`, options: dropdownOptions.conditions },
        { input: `quantity_${itemId}`, dropdown: `quantity_dropdown_${itemId}`, options: dropdownOptions.quantities },
        { input: `unit_dropdown_${itemId}`, dropdown: `unit_dropdown_${itemId}`, options: dropdownOptions.units },
        { input: `remarks_${itemId}`, dropdown: `remarks_dropdown_${itemId}`, options: dropdownOptions.remarks },
        { input: `priority_${itemId}`, dropdown: `priority_dropdown_${itemId}`, options: dropdownOptions.priorities }
    ];

    dropdowns.forEach(({ input, dropdown, options }) => {
        const inputElement = document.querySelector(`[name="${input}"]`);
        const dropdownElement = document.getElementById(dropdown);

        if (inputElement && dropdownElement) {
            setupDropdownForElement(inputElement, dropdownElement, options);
        }
    });
}

// Setup dropdown for specific element
function setupDropdownForElement(input, dropdown, options) {
    input.addEventListener('input', function () {
        const value = this.value.toLowerCase();
        const filtered = options.filter(option =>
            option.toLowerCase().includes(value)
        );

        if (filtered.length > 0 && value) {
            dropdown.innerHTML = filtered.map(option =>
                `<div class="dropdown-item" onclick="selectDropdownValue(this, '${option}')">${option}</div>`
            ).join('');
            dropdown.style.display = 'block';
        } else {
            dropdown.style.display = 'none';
        }
    });

    input.addEventListener('focus', function () {
        dropdown.innerHTML = options.map(option =>
            `<div class="dropdown-item" onclick="selectDropdownValue(this, '${option}')">${option}</div>`
        ).join('');
        dropdown.style.display = 'block';
    });
}

// Select dropdown value
function selectDropdownValue(element, value) {
    const dropdown = element.parentElement;
    const input = dropdown.previousElementSibling;
    input.value = value;
    dropdown.style.display = 'none';

    // Auto-update unit if sparepart is selected
    if (input.name && input.name.includes('sparepart_')) {
        const itemId = input.name.split('_')[1];
        const unitInput = document.querySelector(`[name="unit_type_${itemId}"]`);
        if (unitInput && sparepartUnitMapping[value]) {
            unitInput.value = sparepartUnitMapping[value];
        }
    }
}

// Clear item
function clearItem(itemId) {
    const item = document.getElementById(`item_${itemId}`);
    const inputs = item.querySelectorAll('input[type="text"], input[type="file"]');
    inputs.forEach(input => {
        input.value = '';
    });

    // Clear photo previews (including containers)
    const photoContainer = document.getElementById(`photoContainer_${itemId}`);
    const previewContainers = photoContainer.querySelectorAll('div[style*="position: relative"]');
    previewContainers.forEach(container => container.remove());
}

// Delete item
function deleteItem(itemId) {
    const item = document.getElementById(`item_${itemId}`);
    if (item) {
        item.remove();
        renumberItems();
    }
}

// Renumber items after deletion
function renumberItems() {
    const itemContainers = document.querySelectorAll('#itemsContainer .item-container[id^="item_"]');
    itemContainers.forEach((container, index) => {
        const newItemId = index + 1;
        const itemNumber = container.querySelector('.item-number');
        if (itemNumber) {
            itemNumber.textContent = `Item ${newItemId}`;
        }

        // Update the container ID
        container.id = `item_${newItemId}`;

        // Update all input names and related IDs within this container
        const inputs = container.querySelectorAll('input[name*="_"]');
        inputs.forEach(input => {
            if (input.name) {
                const nameParts = input.name.split('_');
                if (nameParts.length > 1) {
                    nameParts[nameParts.length - 1] = newItemId.toString();
                    input.name = nameParts.join('_');
                }
            }
        });

        // Update dropdown IDs
        const dropdowns = container.querySelectorAll('[id*="_dropdown_"], [id*="photoContainer_"]');
        dropdowns.forEach(dropdown => {
            if (dropdown.id) {
                const idParts = dropdown.id.split('_');
                if (idParts.length > 1) {
                    idParts[idParts.length - 1] = newItemId.toString();
                    dropdown.id = idParts.join('_');
                }
            }
        });

        // Update button onclick attributes
        const clearBtn = container.querySelector('.btn-clear');
        const deleteBtn = container.querySelector('.btn-delete');

        if (clearBtn) {
            clearBtn.setAttribute('onclick', `clearItem(${newItemId})`);
        }
        if (deleteBtn) {
            deleteBtn.setAttribute('onclick', `deleteItem(${newItemId})`);
        }

        // Update photo upload buttons
        const photoUploadBtn = container.querySelector('.photo-upload');
        const photoInput = container.querySelector('input[type="file"]');

        if (photoUploadBtn) {
            photoUploadBtn.setAttribute('onclick', `addPhotoUpload(${newItemId}, 1)`);
        }
        if (photoInput) {
            photoInput.setAttribute('onchange', `handlePhotoUpload(this, ${newItemId}, 1)`);
        }
    });

    // Update the global counter
    itemCounter = itemContainers.length;
}

// Add work
function addWork() {
    workCounter++;
    const container = document.getElementById('additionalWorkContainer');

    const workHtml = `
                <div class="item-container" id="work_${workCounter}">
                    <div class="item-header">
                        <span class="item-number">Pekerjaan ${workCounter}</span>
                        <div class="item-actions">
                            <button type="button" class="btn-small btn-clear" onclick="clearWork(${workCounter})">Clear</button>
                            <button type="button" class="btn-small btn-delete" onclick="deleteWork(${workCounter})">Delete</button>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Pekerjaan Lainnya</label>
                            <div class="dropdown-container">
                                <input type="text" class="form-input" name="additional_work_${workCounter}" placeholder="Pilih pekerjaan" autocomplete="off">
                                <div class="dropdown-list" id="work_dropdown_${workCounter}"></div>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Kondisi</label>
                            <div class="dropdown-container">
                                <input type="text" class="form-input" name="work_condition_${workCounter}" placeholder="Pilih kondisi" autocomplete="off">
                                <div class="dropdown-list" id="work_condition_dropdown_${workCounter}"></div>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Keterangan</label>
                            <input type="text" class="form-input" name="work_description_${workCounter}" placeholder="Masukkan keterangan">
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Remarks</label>
                            <div class="dropdown-container">
                                <input type="text" class="form-input" name="work_remarks_${workCounter}" placeholder="Pilih remarks" autocomplete="off">
                                <div class="dropdown-list" id="work_remarks_dropdown_${workCounter}"></div>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Prioritas</label>
                            <div class="dropdown-container">
                                <input type="text" class="form-input" name="work_priority_${workCounter}" placeholder="Pilih prioritas" autocomplete="off">
                                <div class="dropdown-list" id="work_priority_dropdown_${workCounter}"></div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Foto</label>
                        <div id="workPhotoContainer_${workCounter}">
                            <div class="photo-upload" onclick="addWorkPhotoUpload(${workCounter}, 1)">
                                <span>📷 Klik untuk upload foto</span>
                                <input type="file" accept="image/*" style="display: none;" onchange="handleWorkPhotoUpload(this, ${workCounter}, 1)">
                            </div>
                        </div>
                    </div>
                </div>
            `;

    container.insertAdjacentHTML('beforeend', workHtml);

    // Setup dropdowns for this work
    setupWorkDropdowns(workCounter);
}

// Setup dropdowns for work
function setupWorkDropdowns(workId) {
    const dropdowns = [
        { input: `additional_work_${workId}`, dropdown: `work_dropdown_${workId}`, options: dropdownOptions.additionalWork },
        { input: `work_condition_${workId}`, dropdown: `work_condition_dropdown_${workId}`, options: dropdownOptions.workConditions },
        { input: `work_remarks_${workId}`, dropdown: `work_remarks_dropdown_${workId}`, options: dropdownOptions.workRemarks },
        { input: `work_priority_${workId}`, dropdown: `work_priority_dropdown_${workId}`, options: dropdownOptions.priorities }
    ];

    dropdowns.forEach(({ input, dropdown, options }) => {
        const inputElement = document.querySelector(`[name="${input}"]`);
        const dropdownElement = document.getElementById(dropdown);

        if (inputElement && dropdownElement) {
            setupDropdownForElement(inputElement, dropdownElement, options);
        }
    });
}

// Clear work
function clearWork(workId) {
    const work = document.getElementById(`work_${workId}`);
    const inputs = work.querySelectorAll('input[type="text"], input[type="file"]');
    inputs.forEach(input => {
        input.value = '';
    });

    // Clear photo previews (including containers)
    const photoContainer = document.getElementById(`workPhotoContainer_${workId}`);
    const previewContainers = photoContainer.querySelectorAll('div[style*="position: relative"]');
    previewContainers.forEach(container => container.remove());
}

// Delete work
function deleteWork(workId) {
    const work = document.getElementById(`work_${workId}`);
    if (work) {
        work.remove();
        renumberWorks();
    }
}

// Renumber works after deletion
function renumberWorks() {
    const workContainers = document.querySelectorAll('#additionalWorkContainer .item-container[id^="work_"]');
    workContainers.forEach((container, index) => {
        const newWorkId = index + 1;
        const workNumber = container.querySelector('.item-number');
        if (workNumber) {
            workNumber.textContent = `Pekerjaan ${newWorkId}`;
        }

        // Update the container ID
        container.id = `work_${newWorkId}`;

        // Update all input names and related IDs within this container
        const inputs = container.querySelectorAll('input[name*="_"]');
        inputs.forEach(input => {
            if (input.name) {
                const nameParts = input.name.split('_');
                if (nameParts.length > 1) {
                    nameParts[nameParts.length - 1] = newWorkId.toString();
                    input.name = nameParts.join('_');
                }
            }
        });

        // Update dropdown IDs
        const dropdowns = container.querySelectorAll('[id*="_dropdown_"], [id*="workPhotoContainer_"]');
        dropdowns.forEach(dropdown => {
            if (dropdown.id) {
                const idParts = dropdown.id.split('_');
                if (idParts.length > 1) {
                    idParts[idParts.length - 1] = newWorkId.toString();
                    dropdown.id = idParts.join('_');
                }
            }
        });

        // Update button onclick attributes
        const clearBtn = container.querySelector('.btn-clear');
        const deleteBtn = container.querySelector('.btn-delete');

        if (clearBtn) {
            clearBtn.setAttribute('onclick', `clearWork(${newWorkId})`);
        }
        if (deleteBtn) {
            deleteBtn.setAttribute('onclick', `deleteWork(${newWorkId})`);
        }

        // Update photo upload buttons
        const photoUploadBtn = container.querySelector('.photo-upload');
        const photoInput = container.querySelector('input[type="file"]');

        if (photoUploadBtn) {
            photoUploadBtn.setAttribute('onclick', `addWorkPhotoUpload(${newWorkId}, 1)`);
        }
        if (photoInput) {
            photoInput.setAttribute('onchange', `handleWorkPhotoUpload(this, ${newWorkId}, 1)`);
        }
    });

    // Update the global counter
    workCounter = workContainers.length;
}

// Add photo upload
function addPhotoUpload(itemId, photoId) {
    const input = document.querySelector(`#photoContainer_${itemId} input[type="file"]:last-of-type`);
    input.click();
}

// Handle photo upload
function handlePhotoUpload(input, itemId, photoId) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const container = document.getElementById(`photoContainer_${itemId}`);

            // Create preview container
            const previewContainer = document.createElement('div');
            previewContainer.style.cssText = 'position: relative; display: inline-block; margin: 10px;';

            // Create preview
            const preview = document.createElement('img');
            preview.src = e.target.result;
            preview.className = 'photo-preview';
            preview.alt = `Photo ${photoId}`;

            // Create delete button
            const deleteBtn = document.createElement('button');
            deleteBtn.innerHTML = '×';
            deleteBtn.type = 'button';
            deleteBtn.style.cssText = `
                        position: absolute;
                        top: -5px;
                        right: -5px;
                        width: 20px;
                        height: 20px;
                        border-radius: 50%;
                        background: #f44336;
                        color: white;
                        border: none;
                        cursor: pointer;
                        font-size: 14px;
                        font-weight: bold;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    `;
            deleteBtn.onclick = function () {
                previewContainer.remove();
            };

            previewContainer.appendChild(preview);
            previewContainer.appendChild(deleteBtn);

            // Insert before the upload button
            const uploadButton = container.querySelector('.photo-upload');
            container.insertBefore(previewContainer, uploadButton);

            // Reset the file input so it can be used again
            input.value = '';
        };
        reader.readAsDataURL(input.files[0]);
    }
}

// Add work photo upload
function addWorkPhotoUpload(workId, photoId) {
    const input = document.querySelector(`#workPhotoContainer_${workId} input[type="file"]:last-of-type`);
    input.click();
}

// Handle work photo upload
function handleWorkPhotoUpload(input, workId, photoId) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const container = document.getElementById(`workPhotoContainer_${workId}`);

            // Create preview container
            const previewContainer = document.createElement('div');
            previewContainer.style.cssText = 'position: relative; display: inline-block; margin: 10px;';

            // Create preview
            const preview = document.createElement('img');
            preview.src = e.target.result;
            preview.className = 'photo-preview';
            preview.alt = `Work Photo ${photoId}`;

            // Create delete button
            const deleteBtn = document.createElement('button');
            deleteBtn.innerHTML = '×';
            deleteBtn.type = 'button';
            deleteBtn.style.cssText = `
                        position: absolute;
                        top: -5px;
                        right: -5px;
                        width: 20px;
                        height: 20px;
                        border-radius: 50%;
                        background: #f44336;
                        color: white;
                        border: none;
                        cursor: pointer;
                        font-size: 14px;
                        font-weight: bold;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    `;
            deleteBtn.onclick = function () {
                previewContainer.remove();
            };

            previewContainer.appendChild(preview);
            previewContainer.appendChild(deleteBtn);

            // Insert before the upload button
            const uploadButton = container.querySelector('.photo-upload');
            container.insertBefore(previewContainer, uploadButton);

            // Reset the file input so it can be used again
            input.value = '';
        };
        reader.readAsDataURL(input.files[0]);
    }
}

// Handle form submit
const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbz66JFEPxVI9wULxsehPmBbda4itNbk6WdSj1LaKvr9Hksi2da6uwsnYsDRArAMelMyBA/exec'; // URL dari Google Apps Script kamu

async function handleFormSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    try {
        const response = await fetch(WEB_APP_URL, {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            showMessage("Data berhasil dikirim ke Spreadsheet!", "success");
            form.reset();
        } else {
            showMessage("Gagal kirim ke Spreadsheet.", "error");
        }
    } catch (error) {
        console.error(error);
        showMessage("Terjadi kesalahan koneksi ke Spreadsheet.", "error");
    }
}

// Get selected technicians
function getSelectedTechnicians() {
    const checkboxes = document.querySelectorAll('input[name="technicians"]:checked');
    return Array.from(checkboxes).map(cb => cb.value).join(', ');
}

// Collect items data
function collectItemsData() {
    const items = [];
    const itemContainers = document.querySelectorAll('[id^="item_"]');

    itemContainers.forEach(container => {
        const itemData = {};
        const inputs = container.querySelectorAll('input[type="text"]');

        inputs.forEach(input => {
            if (input.value.trim()) {
                itemData[input.name] = input.value.trim();
            }
        });

        // Collect photos for this item
        const photos = [];
        const photoContainer = container.querySelector('[id^="photoContainer_"]');
        if (photoContainer) {
            const photoImages = photoContainer.querySelectorAll('img.photo-preview');
            photoImages.forEach((img, index) => {
                photos.push({
                    name: `photo_${index + 1}`,
                    data: img.src
                });
            });
        }

        if (photos.length > 0) {
            itemData.photos = JSON.stringify(photos);
        }

        if (Object.keys(itemData).length > 0) {
            items.push(itemData);
        }
    });

    return JSON.stringify(items);
}

// Collect additional work data
function collectAdditionalWorkData() {
    const works = [];
    const workContainers = document.querySelectorAll('[id^="work_"]');

    workContainers.forEach(container => {
        const workData = {};
        const inputs = container.querySelectorAll('input[type="text"]');

        inputs.forEach(input => {
            if (input.value.trim()) {
                workData[input.name] = input.value.trim();
            }
        });

        // Collect photos for this work
        const photos = [];
        const photoContainer = container.querySelector('[id^="workPhotoContainer_"]');
        if (photoContainer) {
            const photoImages = photoContainer.querySelectorAll('img.photo-preview');
            photoImages.forEach((img, index) => {
                photos.push({
                    name: `work_photo_${index + 1}`,
                    data: img.src
                });
            });
        }

        if (photos.length > 0) {
            workData.photos = JSON.stringify(photos);
        }

        if (Object.keys(workData).length > 0) {
            works.push(workData);
        }
    });

    return JSON.stringify(works);
}

// Show message
function showMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 20px;
                border-radius: 8px;
                color: white;
                font-weight: 500;
                z-index: 10000;
                animation: slideIn 0.3s ease;
                ${type === 'success' ? 'background: linear-gradient(45deg, #4caf50, #45a049);' : 'background: linear-gradient(45deg, #f44336, #d32f2f);'}
            `;
    messageDiv.textContent = message;

    document.body.appendChild(messageDiv);

    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}



// Render history section
function renderHistorySection() {
    const contentArea = document.getElementById('contentArea');
    contentArea.innerHTML = `
                <div class="history-container">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                        <h2 class="section-title" style="margin: 0;">History Data</h2>
                        <button type="button" class="btn-small" onclick="backToNavigation()" style="background: rgba(255,255,255,0.1); color: white; border: 1px solid rgba(255,255,255,0.3);">← Kembali</button>
                    </div>
                    
                    <div class="search-container">
                        <input type="text" id="searchInput" class="search-input" placeholder="Cari data..." onkeyup="filterHistory()">
                    </div>
                    
                    <div id="historyList">
                        <!-- History items will be populated here -->
                    </div>
                </div>
            `;

    renderHistory();
}

// Render history
function renderHistory() {
    const historyList = document.getElementById('historyList');
    if (!historyList) return;

    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';

    let filteredData = formData.filter(item => {
        return item.building_name?.toLowerCase().includes(searchTerm) ||
            item.technician?.toLowerCase().includes(searchTerm) ||
            item.form_type?.toLowerCase().includes(searchTerm) ||
            item.date?.includes(searchTerm);
    });

    if (filteredData.length === 0) {
        historyList.innerHTML = `
                    <div style="text-align: center; color: #b0b0b0; padding: 50px;">
                        📋 Belum ada data yang tersimpan
                    </div>
                `;
        return;
    }

    historyList.innerHTML = filteredData.map(item => `
                <div class="history-item">
                    <div class="history-header">
                        <div>
                            <h3 style="margin: 0; color: #00d4ff;">${item.form_type?.toUpperCase()} - ${item.building_name}</h3>
                            <p style="margin: 5px 0; color: #b0b0b0;">Teknisi: ${item.technician} | Tanggal: ${item.date}</p>
                            <p style="margin: 5px 0; color: #b0b0b0;">Unit: ${item.header_unit || 'N/A'} | MFG: ${item.header_mfg || 'N/A'} | Type: ${item.header_type || 'N/A'}</p>
                        </div>
                        <div class="history-actions">
                            <button class="btn-download" onclick="downloadPDF('${item.id}')">📄 PDF</button>
                            <button class="btn-download" onclick="downloadWord('${item.id}')">📝 Word</button>
                            ${currentUserType === 'admin' ? `
                                <button class="btn-edit" onclick="reviewData('${item.id}')" style="background: linear-gradient(45deg, #9c27b0, #673ab7);">👁️ Review</button>
                                <button class="btn-edit" onclick="editData('${item.id}')">✏️ Edit</button>
                                <button class="btn-small btn-delete" onclick="deleteData('${item.id}')">🗑️ Delete</button>
                            ` : ''}
                        </div>
                    </div>
                    <div style="margin-top: 10px; font-size: 14px; color: #e0e0e0;">
                        Status: ${item.status} | Dibuat: ${new Date(item.created_at).toLocaleString('id-ID')}
                    </div>
                </div>
            `).join('');
}

// Filter history
function filterHistory() {
    renderHistory();
}

// Download PDF
function downloadPDF(itemId) {
    const item = formData.find(d => d.id === itemId);
    if (!item) return;

    // Create HTML content for PDF
    let htmlContent = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <title>Laporan ${item.form_type?.toUpperCase()}</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; }
                        .header { text-align: center; margin-bottom: 30px; }
                        .company-name { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
                        .report-title { font-size: 18px; margin-bottom: 20px; }
                        .info-section { margin-bottom: 20px; }
                        .info-row { display: flex; margin-bottom: 10px; }
                        .info-label { font-weight: bold; width: 150px; }
                        .section-title { font-size: 16px; font-weight: bold; margin: 20px 0 10px 0; border-bottom: 1px solid #ccc; padding-bottom: 5px; }
                        .item-container { margin-bottom: 20px; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
                        .item-title { font-weight: bold; margin-bottom: 10px; color: #333; }
                        .item-detail { margin-bottom: 5px; }
                        .photo-container { margin: 10px 0; }
                        .photo { max-width: 300px; max-height: 200px; margin: 5px; border: 1px solid #ccc; }
                        .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <div class="company-name">PT. JAYA KENCANA</div>
                        <div class="report-title">LAPORAN ${item.form_type?.toUpperCase()}</div>
                    </div>
                    
                    <div class="info-section">
                        <div class="info-row">
                            <div class="info-label">Gedung/Proyek:</div>
                            <div>${item.building_name || 'N/A'}</div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">Teknisi:</div>
                            <div>${item.technician || 'N/A'}</div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">Tanggal:</div>
                            <div>${item.date || 'N/A'}</div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">Unit:</div>
                            <div>${item.header_unit || 'N/A'}</div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">MFG:</div>
                            <div>${item.header_mfg || 'N/A'}</div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">Type:</div>
                            <div>${item.header_type || 'N/A'}</div>
                        </div>
                    </div>
            `;

    // Add items section
    if (item.items) {
        try {
            const items = JSON.parse(item.items);
            htmlContent += '<div class="section-title">ITEMS</div>';

            items.forEach((itm, idx) => {
                htmlContent += `<div class="item-container">`;
                htmlContent += `<div class="item-title">Item ${idx + 1}</div>`;

                Object.entries(itm).forEach(([key, value]) => {
                    if (key !== 'photos') {
                        htmlContent += `<div class="item-detail"><strong>${key.replace(/_/g, ' ').toUpperCase()}:</strong> ${value}</div>`;
                    }
                });

                // Add photos if available
                if (itm.photos) {
                    try {
                        const photos = JSON.parse(itm.photos);
                        if (photos.length > 0) {
                            htmlContent += '<div class="photo-container">';
                            htmlContent += '<div style="font-weight: bold; margin-bottom: 10px;">Foto:</div>';
                            photos.forEach(photo => {
                                htmlContent += `<img src="${photo.data}" alt="${photo.name}" class="photo">`;
                            });
                            htmlContent += '</div>';
                        }
                    } catch (e) {
                        console.error('Error parsing item photos:', e);
                    }
                }

                htmlContent += '</div>';
            });
        } catch (e) {
            htmlContent += '<div>Error parsing items data</div>';
        }
    }

    // Add additional work section
    if (item.additional_work) {
        try {
            const works = JSON.parse(item.additional_work);
            htmlContent += '<div class="section-title">PEKERJAAN TAMBAHAN</div>';

            works.forEach((work, idx) => {
                htmlContent += `<div class="item-container">`;
                htmlContent += `<div class="item-title">Pekerjaan ${idx + 1}</div>`;

                Object.entries(work).forEach(([key, value]) => {
                    if (key !== 'photos') {
                        htmlContent += `<div class="item-detail"><strong>${key.replace(/_/g, ' ').toUpperCase()}:</strong> ${value}</div>`;
                    }
                });

                // Add photos if available
                if (work.photos) {
                    try {
                        const photos = JSON.parse(work.photos);
                        if (photos.length > 0) {
                            htmlContent += '<div class="photo-container">';
                            htmlContent += '<div style="font-weight: bold; margin-bottom: 10px;">Foto:</div>';
                            photos.forEach(photo => {
                                htmlContent += `<img src="${photo.data}" alt="${photo.name}" class="photo">`;
                            });
                            htmlContent += '</div>';
                        }
                    } catch (e) {
                        console.error('Error parsing work photos:', e);
                    }
                }

                htmlContent += '</div>';
            });
        } catch (e) {
            htmlContent += '<div>Error parsing additional work data</div>';
        }
    }

    htmlContent += `
                    <div class="footer">
                        <div>Dibuat: ${new Date(item.created_at).toLocaleString('id-ID')}</div>
                        <div>Status: ${item.status || 'N/A'}</div>
                    </div>
                </body>
                </html>
            `;

    // Create and download HTML file
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${item.form_type}_${item.building_name}_${item.date}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showMessage("File PDF berhasil diunduh!", "success");
}

// Download Word
function downloadWord(itemId) {
    const item = formData.find(d => d.id === itemId);
    if (!item) return;

    // Create Word-compatible HTML content
    let wordContent = `
                <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
                <head>
                    <meta charset="utf-8">
                    <title>Laporan ${item.form_type?.toUpperCase()}</title>
                    <!--[if gte mso 9]>
                    <xml>
                        <w:WordDocument>
                            <w:View>Print</w:View>
                            <w:Zoom>90</w:Zoom>
                            <w:DoNotPromptForConvert/>
                            <w:DoNotShowInsertionsAndDeletions/>
                        </w:WordDocument>
                    </xml>
                    <![endif]-->
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; }
                        .header { text-align: center; margin-bottom: 30px; }
                        .company-name { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
                        .report-title { font-size: 18px; margin-bottom: 20px; }
                        .info-section { margin-bottom: 20px; }
                        .info-row { margin-bottom: 10px; }
                        .info-label { font-weight: bold; display: inline-block; width: 150px; }
                        .section-title { font-size: 16px; font-weight: bold; margin: 20px 0 10px 0; border-bottom: 1px solid #ccc; padding-bottom: 5px; }
                        .item-container { margin-bottom: 20px; padding: 15px; border: 1px solid #ddd; }
                        .item-title { font-weight: bold; margin-bottom: 10px; color: #333; }
                        .item-detail { margin-bottom: 5px; }
                        .photo-container { margin: 10px 0; }
                        .photo { max-width: 300px; max-height: 200px; margin: 5px; }
                        .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <div class="company-name">PT. JAYA KENCANA</div>
                        <div class="report-title">LAPORAN ${item.form_type?.toUpperCase()}</div>
                    </div>
                    
                    <div class="info-section">
                        <div class="info-row">
                            <span class="info-label">Gedung/Proyek:</span>
                            <span>${item.building_name || 'N/A'}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Teknisi:</span>
                            <span>${item.technician || 'N/A'}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Tanggal:</span>
                            <span>${item.date || 'N/A'}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Unit:</span>
                            <span>${item.header_unit || 'N/A'}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">MFG:</span>
                            <span>${item.header_mfg || 'N/A'}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Type:</span>
                            <span>${item.header_type || 'N/A'}</span>
                        </div>
                    </div>
            `;

    // Add items section
    if (item.items) {
        try {
            const items = JSON.parse(item.items);
            wordContent += '<div class="section-title">ITEMS</div>';

            items.forEach((itm, idx) => {
                wordContent += `<div class="item-container">`;
                wordContent += `<div class="item-title">Item ${idx + 1}</div>`;

                Object.entries(itm).forEach(([key, value]) => {
                    if (key !== 'photos') {
                        wordContent += `<div class="item-detail"><strong>${key.replace(/_/g, ' ').toUpperCase()}:</strong> ${value}</div>`;
                    }
                });

                // Add photos if available
                if (itm.photos) {
                    try {
                        const photos = JSON.parse(itm.photos);
                        if (photos.length > 0) {
                            wordContent += '<div class="photo-container">';
                            wordContent += '<div style="font-weight: bold; margin-bottom: 10px;">Foto:</div>';
                            photos.forEach(photo => {
                                wordContent += `<img src="${photo.data}" alt="${photo.name}" class="photo">`;
                            });
                            wordContent += '</div>';
                        }
                    } catch (e) {
                        console.error('Error parsing item photos:', e);
                    }
                }

                wordContent += '</div>';
            });
        } catch (e) {
            wordContent += '<div>Error parsing items data</div>';
        }
    }

    // Add additional work section
    if (item.additional_work) {
        try {
            const works = JSON.parse(item.additional_work);
            wordContent += '<div class="section-title">PEKERJAAN TAMBAHAN</div>';

            works.forEach((work, idx) => {
                wordContent += `<div class="item-container">`;
                wordContent += `<div class="item-title">Pekerjaan ${idx + 1}</div>`;

                Object.entries(work).forEach(([key, value]) => {
                    if (key !== 'photos') {
                        wordContent += `<div class="item-detail"><strong>${key.replace(/_/g, ' ').toUpperCase()}:</strong> ${value}</div>`;
                    }
                });

                // Add photos if available
                if (work.photos) {
                    try {
                        const photos = JSON.parse(work.photos);
                        if (photos.length > 0) {
                            wordContent += '<div class="photo-container">';
                            wordContent += '<div style="font-weight: bold; margin-bottom: 10px;">Foto:</div>';
                            photos.forEach(photo => {
                                wordContent += `<img src="${photo.data}" alt="${photo.name}" class="photo">`;
                            });
                            wordContent += '</div>';
                        }
                    } catch (e) {
                        console.error('Error parsing work photos:', e);
                    }
                }

                wordContent += '</div>';
            });
        } catch (e) {
            wordContent += '<div>Error parsing additional work data</div>';
        }
    }

    wordContent += `
                    <div class="footer">
                        <div>Dibuat: ${new Date(item.created_at).toLocaleString('id-ID')}</div>
                        <div>Status: ${item.status || 'N/A'}</div>
                    </div>
                </body>
                </html>
            `;

    // Create and download Word file
    const blob = new Blob([wordContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${item.form_type}_${item.building_name}_${item.date}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showMessage("File Word berhasil diunduh!", "success");
}

// Edit data (admin only)
function editData(itemId) {
    if (currentUserType !== 'admin') return;

    const item = formData.find(d => d.id === itemId);
    if (!item) return;

    // Navigate to form section with pre-filled data
    navigateToSection(item.form_type);

    // Wait for form to render then populate data
    setTimeout(() => {
        populateFormForEdit(item);
    }, 100);
}

// Populate form for editing
function populateFormForEdit(item) {
    // Fill basic form fields
    document.getElementById('buildingName').value = item.building_name || '';
    document.getElementById('workDate').value = item.date || '';
    document.getElementById('headerUnit').value = item.header_unit || '';
    document.getElementById('headerMFG').value = item.header_mfg || '';
    document.getElementById('headerType').value = item.header_type || '';

    // Check technician checkboxes
    if (item.technician) {
        const techNames = item.technician.split(', ');
        techNames.forEach(techName => {
            const checkbox = document.querySelector(`input[value="${techName}"]`);
            if (checkbox) checkbox.checked = true;
        });
    }

    // Clear existing items and works
    document.getElementById('itemsContainer').innerHTML = '';
    document.getElementById('additionalWorkContainer').innerHTML = '';
    itemCounter = 0;
    workCounter = 0;

    // Populate items
    if (item.items) {
        try {
            const items = JSON.parse(item.items);
            items.forEach(itemData => {
                addItem();
                const currentItemId = itemCounter;

                // Fill item data
                Object.entries(itemData).forEach(([key, value]) => {
                    const input = document.querySelector(`[name="${key}"]`);
                    if (input) input.value = value;
                });
            });
        } catch (e) {
            console.error('Error parsing items:', e);
        }
    }

    // Populate additional work
    if (item.additional_work) {
        try {
            const works = JSON.parse(item.additional_work);
            works.forEach(workData => {
                addWork();
                const currentWorkId = workCounter;

                // Fill work data
                Object.entries(workData).forEach(([key, value]) => {
                    const input = document.querySelector(`[name="${key}"]`);
                    if (input) input.value = value;
                });
            });
        } catch (e) {
            console.error('Error parsing additional work:', e);
        }
    }

    // Change submit button to update
    const submitBtn = document.querySelector('#mainForm button[type="submit"]');
    if (submitBtn) {
        submitBtn.textContent = 'Update Data';
        submitBtn.onclick = (e) => handleUpdateSubmit(e, item.id);
    }

    showMessage("Data berhasil dimuat untuk diedit", "success");
}

// Handle update submit
async function handleUpdateSubmit(e, originalId) {
    e.preventDefault();

    const form = e.target.closest('form');
    const submitButton = form.querySelector('button[type="submit"]');

    // Show loading state
    submitButton.classList.add('loading');
    submitButton.textContent = 'Mengupdate...';

   try {
    // Find original item
    const originalItem = formData;
} catch (error) {
    console.error('Terjadi error saat mencari item asli:', error);
}
