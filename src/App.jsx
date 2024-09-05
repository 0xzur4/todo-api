import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Handle from './handlers/Handle';
import './App.css';

function App() {
  const {
    card,
    icon,
    title,
    text,
    data,
    selectedIds,
    handleDelete,
    handleCard,
    handleSubmit,
    setTitle,
    setText,
    setSelectedIds
  } = Handle();

  const handleDoubleClick = (index) => {
    setSelectedIds(prevSelectedIds => {
      if (prevSelectedIds.includes(index)) {
        return prevSelectedIds.filter(id => id !== index);
      } else {
        return [...prevSelectedIds, index];
      }
    });
  };

  return (
    <div className='container'>
      <header>
        <h1 style={{ borderBottom: 'solid 2px', textAlign: 'center' }}>Todo List</h1>
        <nav style={{ display: 'flex', justifyContent: 'flex-end', borderBottom: 'solid 2px', borderTop: 'solid 2px' }}>
          <ul style={{ listStyle: 'none', display: 'flex' }}>
            <li style={{ cursor: 'pointer', marginLeft: '10px', fontSize: '24px' }} onClick={handleCard}>{icon ? '-' : '+'}</li>
            <li style={{ cursor: 'pointer', marginLeft: '10px', fontSize: '24px' }}>&#128465;</li>
          </ul>
        </nav>
      </header>
      <div style={{ width: '1280px', flexDirection: 'row', justifyContent: 'center', border: 'solid 1.5px', marginTop: '20px', zIndex: '1', display: card ? 'block' : 'none' }}>
        <h2>Create todo-list</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Title: </label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />

          <ReactQuill
            value={text}
            onChange={setText}
            placeholder='Write something amazing...'
          />

          <button type="submit">Create</button>
        </form>
      </div>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px', 
        marginTop: '20px',
        justifyContent: 'flex-start', 
      }}>
        {data.map((datas, index) => (
          <div
            key={index}
            onDoubleClick={() => handleDoubleClick(index)}
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
                <img src='/edit.png' style={{ height: '20px', width: '20px', cursor: 'pointer' }} />
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
        ))}
      </div>
    </div>
  );
}

export default App;
