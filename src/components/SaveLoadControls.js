import { useState } from 'react'; 

function SaveLoadControls({ currentSettings, onLoadSettings }) {

    const [filename, setFilename] = useState('');

    const handleSave = () => {
        const settingsJSON = JSON.stringify(currentSettings, null, 2);
        const blob = new Blob([settingsJSON], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = filename || `strudel-settings-${Date.now()}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
    };

    const handleLoad = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const loadedSettings = JSON.parse(event.target.result);
                onLoadSettings(loadedSettings);
            } catch (error) {
                alert("Invalid JSON file!");
            }
        };
        reader.readAsText(file);
    };

        // bootstrap html section 
    return (
        <div className="mt-3">
            <h6 style={{color: '#00d4ff', marginBottom: '10px'}}>Settings</h6>
        
            <label htmlFor="load-file" className="form-label" style={{fontSize: '0.9rem', color: '#e0e0e0'}}>
                Load Settings
            </label>
            <input 
                className="form-control form-control-sm" 
                type="file" 
                id="load-file"
                accept=".json"
                onChange={handleLoad}
            />
            

            <div className="input-group input-group-sm mt-2">
                <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Enter filename..."
                    value={filename}
                    onChange={(e) => setFilename(e.target.value)}
                />
                <button className="btn btn-success" onClick={handleSave}>
                    Save
                </button>
            </div>
        </div>
    );
}

export default SaveLoadControls;