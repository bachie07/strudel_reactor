function SaveLoadControls({ currentSettings, onLoadSettings }) {

    const handleSave = () => {
        const settingsJSON = JSON.stringify(currentSettings, null, 2);
        const blob = new Blob([settingsJSON], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `strudel-settings-${Date.now()}.json`;
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

    return (
        <div className="mt-3">
            <h5>Save/Load Settings</h5>
            <div className="btn-group" role="group">
                <button className="btn btn-success" onClick={handleSave}>
                    💾 Save
                </button>
                <label className="btn btn-info" htmlFor="load-file">
                    📁 Load
                </label>
                <input
                    type="file"
                    id="load-file"
                    accept=".json"
                    style={{ display: 'none' }}
                    onChange={handleLoad}
                />
            </div>
        </div>
    );
}

export default SaveLoadControls;