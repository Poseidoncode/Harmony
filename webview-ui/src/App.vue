<template>
  <div class="container">
    <div class="header">
        <h1>Harmony Prompts</h1>
        <button class="icon-btn" @click="openSettings" title="Manage Templates">⚙️</button>
    </div>
    <div class="search-box">
        <input type="text" v-model="searchQuery" placeholder="Search templates..." />
    </div>

    <!-- Template List -->
    <div v-if="!selectedTemplate" class="template-list">
        <div v-if="filteredTemplates.length === 0" class="no-results">
            No templates found.
        </div>
        <div 
            v-for="template in filteredTemplates" 
            :key="template.id" 
            class="template-item"
            @click="selectTemplate(template)"
        >
            <div class="template-name">{{ template.name }}</div>
            <div class="template-desc">{{ template.description }}</div>
        </div>
    </div>

    <!-- Template Form -->
    <div v-else class="template-form">
        <button class="back-btn" @click="selectedTemplate = null">← Back</button>
        <h2>{{ selectedTemplate.name }}</h2>
        <p class="template-desc-detail">{{ selectedTemplate.description }}</p>
        
        <div v-for="field in selectedTemplate.fields" :key="field.name" class="form-group">
            <label class="field-label">{{ field.label }}</label>
            
            <!-- Text Input -->
            <input 
                v-if="field.type === 'text'" 
                v-model="formData[field.name]" 
                :placeholder="field.placeholder"
                class="vs-input"
            />
            
            <!-- Textarea -->
            <textarea 
                v-if="field.type === 'textarea'" 
                v-model="formData[field.name]"
                :placeholder="field.placeholder"
                rows="4"
                class="vs-input"
            ></textarea>
            
            <!-- Select -->
            <select 
                v-if="field.type === 'select'" 
                v-model="formData[field.name]"
                class="vs-select"
            >
                <option v-for="opt in field.options" :key="opt" :value="opt">{{ opt }}</option>
            </select>

            <!-- Radio Group -->
            <div v-if="field.type === 'radio'" class="radio-group">
                <div v-for="opt in field.options" :key="opt" class="radio-item">
                    <input 
                        type="radio" 
                        :id="`${field.name}-${opt}`" 
                        :name="field.name" 
                        :value="opt"
                        v-model="formData[field.name]"
                    >
                    <label :for="`${field.name}-${opt}`">{{ opt }}</label>
                </div>
            </div>

            <!-- Checkbox -->
            <div v-if="field.type === 'checkbox'" class="checkbox-group">
                <input 
                    type="checkbox" 
                    :id="field.name" 
                    v-model="formData[field.name]"
                    :true-value="field.checkedValue || 'true'"
                    :false-value="field.uncheckedValue || ''"
                >
                <label :for="field.name" class="inline-label">{{ field.placeholder || 'Enable' }}</label>
            </div>
        </div>

        <div class="actions">
            <button class="primary-btn" @click="generateAndInsert">Insert to Editor</button>
            <button class="secondary-btn" @click="copyToClipboard">Copy</button>
        </div>

        <div class="preview">
            <label>Preview:</label>
            <div class="preview-content">{{ generatedPrompt }}</div>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue';

// --- Types ---
interface Field {
    name: string;
    label: string;
    type: 'text' | 'textarea' | 'select' | 'radio' | 'checkbox';
    placeholder?: string;
    options?: string[];
    defaultValue?: string;
    checkedValue?: string;
    uncheckedValue?: string;
}

interface Template {
    id: string;
    name: string;
    description: string;
    template: string;
    fields: Field[];
}

// --- VS Code API ---
const vscode = (window as any).acquireVsCodeApi();

// --- Data ---
const searchQuery = ref('');
const selectedTemplate = ref<Template | null>(null);
const formData = reactive<Record<string, string>>({});
const templates = ref<Template[]>([]);

// --- Computed ---
const filteredTemplates = computed(() => {
    if (!searchQuery.value) return templates.value;
    const q = searchQuery.value.toLowerCase();
    return templates.value.filter(t => 
        t.name.toLowerCase().includes(q) || 
        t.description.toLowerCase().includes(q)
    );
});

const generatedPrompt = computed(() => {
    if (!selectedTemplate.value) return '';
    let result = selectedTemplate.value.template;
    
    // Replace placeholders
    selectedTemplate.value.fields.forEach(field => {
        const val = formData[field.name] || '';
        result = result.replace(new RegExp(`{{${field.name}}}`, 'g'), val);
    });
    
    return result;
});

// --- Methods ---
const selectTemplate = (t: Template) => {
    selectedTemplate.value = t;
    // Reset form data with default values
    Object.keys(formData).forEach(k => delete formData[k]);
    t.fields.forEach(f => {
        if (f.type === 'checkbox') {
             formData[f.name] = f.defaultValue === 'true' ? (f.checkedValue || 'true') : (f.uncheckedValue || '');
        } else {
             formData[f.name] = f.defaultValue || '';
        }
    });
};

const generateAndInsert = () => {
    vscode.postMessage({
        type: 'insertText',
        value: generatedPrompt.value
    });
};

const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPrompt.value).then(() => {
        vscode.postMessage({ type: 'onInfo', value: 'Copied to clipboard!' });
    }).catch(() => {
        vscode.postMessage({ type: 'onInfo', value: 'Clipboard access failed. Text sent to editor instead.' });
        generateAndInsert();
    });
};

const openSettings = () => {
    vscode.postMessage({ type: 'open-templates-file' });
};

onMounted(() => {
    // Listen for messages from the extension
    window.addEventListener('message', event => {
        const message = event.data;
        switch (message.type) {
            case 'update-templates':
                templates.value = message.value;
                break;
        }
    });

    // Request initial templates
    vscode.postMessage({ type: 'get-templates' });
});

</script>

<style>
:root {
  --radius: 4px;
}

body {
    padding: 0;
    margin: 0;
    color: var(--vscode-foreground);
    background-color: var(--vscode-editor-background);
    font-family: var(--vscode-font-family);
    font-size: var(--vscode-font-size);
}

.container {
    padding: 16px;
    max-width: 100%;
    box-sizing: border-box;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
}

h1 {
    font-size: 1.1rem;
    font-weight: 600;
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    opacity: 0.9;
}

.icon-btn {
    background: none;
    border: none;
    color: var(--vscode-foreground);
    cursor: pointer;
    font-size: 1.2rem;
    padding: 4px;
    opacity: 0.7;
    transition: opacity 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    width: auto;
    flex: 0 0 auto;
}

.icon-btn:hover {
    opacity: 1;
}

.search-box input {
    width: 100%;
    padding: 8px;
    background: var(--vscode-input-background);
    border: 1px solid var(--vscode-input-border);
    color: var(--vscode-input-foreground);
    border-radius: var(--radius);
    margin-bottom: 16px;
}
.search-box input:focus {
    outline: 1px solid var(--vscode-focusBorder);
}

.template-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.template-item {
    padding: 12px;
    background: var(--vscode-list-hoverBackground); /* subtle background */
    border: 1px solid transparent;
    border-radius: var(--radius);
    cursor: pointer;
    transition: all 0.2s;
}

.template-item:hover {
    background: var(--vscode-list-activeSelectionBackground);
    color: var(--vscode-list-activeSelectionForeground);
}

.template-name {
    font-weight: 600;
    margin-bottom: 4px;
}

.template-desc {
    font-size: 0.85em;
    opacity: 0.8;
    line-height: 1.4;
}

/* Form Styling */
.back-btn {
    background: none;
    border: none;
    color: var(--vscode-textLink-foreground);
    cursor: pointer;
    padding: 0;
    font-size: 0.9em;
    margin-bottom: 12px;
    text-decoration: underline;
}

.form-group {
    margin-bottom: 16px;
}

.field-label {
    display: block;
    font-weight: 500;
    margin-bottom: 6px;
    font-size: 0.9em;
}

.vs-input, .vs-select {
    width: 100%;
    box-sizing: border-box;
    padding: 8px;
    background: var(--vscode-input-background);
    border: 1px solid var(--vscode-input-border);
    color: var(--vscode-input-foreground);
    border-radius: var(--radius);
    font-family: inherit;
}

.vs-input:focus, .vs-select:focus {
    outline: 1px solid var(--vscode-focusBorder);
    border-color: var(--vscode-focusBorder);
}

/* Radio & Checkbox */
.radio-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.radio-item {
    display: flex;
    align-items: center;
    gap: 6px;
}

.checkbox-group {
    display: flex;
    align-items: center;
    gap: 8px;
}

.actions {
    display: flex;
    gap: 10px;
    margin-top: 20px;
}

button {
    flex: 1;
    padding: 10px;
    border-radius: var(--radius);
    border: none;
    cursor: pointer;
    font-weight: 500;
    transition: opacity 0.2s;
}

button:hover {
    opacity: 0.9;
}

.primary-btn {
    background: var(--vscode-button-background);
    color: var(--vscode-button-foreground);
}

.secondary-btn {
    background: var(--vscode-button-secondaryBackground);
    color: var(--vscode-button-secondaryForeground);
}

.preview {
    margin-top: 24px;
    border-top: 1px solid var(--vscode-panel-border);
    padding-top: 16px;
}

.preview label {
    display: block;
    margin-bottom: 8px;
    font-size: 0.85em;
    opacity: 0.7;
    text-transform: uppercase;
}

.preview-content {
    background: var(--vscode-editor-inactiveSelectionBackground);
    padding: 12px;
    border-radius: var(--radius);
    white-space: pre-wrap;
    font-family: var(--vscode-editor-font-family);
    font-size: 0.9em;
    border: 1px solid var(--vscode-widget-border);
}
</style>