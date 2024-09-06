import React, { useState } from 'react';

const EditHandle = ({ datas, handleDelete, doubleClick, selectedIds, handleEdit, index }) => {
    const [isEdit, setIsEdit] = useState(false);
    const [editedTitle, setEditedTitle] = useState(datas.title);
    const [editedText, setEditedText] = useState(datas.text);

    const startEdit = () => {
        setIsEdit(true);
    };

    const saveEdit = async () => {
        try {
            console.log('Saving edits:', editedTitle, editedText);
            await handleEdit(datas.title, editedTitle, editedText);
            setIsEdit(false);
        } catch (error) {
            console.error('Failed to save edit:', error);
        }
    };

    return (
        <div>
            {isEdit ? (
                <>
                    <input
                        type="text"
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        style={{ width: '100%', marginBottom: '10px' }}
                    />
                    <textarea
                        value={editedText}
                        onChange={(e) => setEditedText(e.target.value)}
                        style={{ width: '100%' }}
                    ></textarea>
                    <button onClick={saveEdit}>Save</button>
                    <button onClick={() => setIsEdit(false)}>Cancel</button>
                </>
            ) : (
                <div
                    key={index}
                    onDoubleClick={() => doubleClick(index)}
                    style={{
                        width: '200px',
                        height: 'auto',
                        padding: '10px',
                        border: 'solid 1px',
                        display: 'flex',
                        flexDirection: 'column',
                        backgroundColor: selectedIds.includes(index) ? 'green' : '#242424'
                    }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px', borderBottom: 'solid 1.5px' }}>
                        <h3>{datas.title}</h3>
                        <div style={{ display: 'flex', gap: '5px', marginLeft: 'auto' }}>
                            <img src='/edit.png' style={{ height: '20px', width: '20px', cursor: 'pointer' }} onClick={startEdit} />
                            <img src='/delete.png' style={{ height: '20px', width: '20px', cursor: 'pointer' }} onClick={() => handleDelete(datas.title)} />
                        </div>
                    </div>
                    <p
                        style={{
                            width: '100%',
                            wordWrap: 'break-word',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'normal'
                        }}
                        dangerouslySetInnerHTML={{ __html: datas.text }}>
                    </p>
                </div>
            )}
        </div>
    );
};

export default EditHandle;
