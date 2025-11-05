function ProcessTextArea( { textValue, onTextChange }){

    return(
        <div>
        <label htmlFor="exampleFormControlTextarea1" className="form-label">Text to preprocess:</label>
        <textarea className="form-control" rows="15" defaultValue={textValue} onChange={onTextChange} id="proc" ></textarea>
        </div>
    );
}

export default ProcessTextArea;

