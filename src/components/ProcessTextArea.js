function ProcessTextArea( { textValue, onTextChange }){

    return(
        <div>
        <textarea className="form-control" rows="15" defaultValue={textValue} onChange={onTextChange} id="proc" style={{
        width: '100%',
        height: '100%', 
        minHeight: '200px',
        resize: 'none'
            }}></textarea>
        </div>
    );
}

export default ProcessTextArea;

