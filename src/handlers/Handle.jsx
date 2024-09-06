import { useState, useEffect } from 'react';


const Handle = () => {
    const [card, setCard] = useState(false);
    const [icon, setIcon] = useState(false);
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [data, setData] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);

    const handleCard = () => {
        setCard(!card);
        setIcon(!icon);
    };

    const handleEdit = async (originalTitle, newTitle, newtext) => {
        const updatedTodo = {
            title: newTitle,
            text: newtext,
        };
    
    
        try {
            const response = await fetch(`http://localhost:8000/api/todo/update/${originalTitle}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedTodo),
            });

            if (response.ok) {
                // Update data setelah berhasil mengedit
                setData(prevData => prevData.map(item => 
                    item.title === originalTitle ? { ...item, title: newTitle, text: newtext } : item
                ));
            } else {
                console.error('Failed to update item');
            }
        } catch (error) {
            console.error('Error occurred while updating item:', error);
        }
    };

    const handleDelete = async (title) => {
        console.log('Data yang diterima', data);

        try {
            const response = await fetch(`http://localhost:8000/api/todo/delete/${encodeURIComponent(title)}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const result = await response.json()
                console.log(result);


                const updatedData = await fetch('http://localhost:8000/api/todo').then(res => res.json());
                setData(updatedData);
            } else {
                const errorMessage = await response.text();
                console.error('Failed delete item:', errorMessage);
            }
        } catch (error) {
            console.error('Error occurred while deleting item:', error);
        }
    };

    useEffect(() => {
        fetch('http://localhost:8000/api/todo')
            .then(response => response.json())
            .then(data => {
                setData(data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const todo = {
            title: title,
            text: text,
        };

        try {
            const res = await fetch('http://localhost:8000/api/todo/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(todo),
            });


            const result = await res.text();
            console.log(result);

            setTitle('');
            setText('');

        } catch (error) {
            console.error('Failed to add todo:', error);
        }
    };

    return {
        card,
        icon,
        title,
        text,
        data,
        selectedIds,
        handleEdit,
        handleCard,
        handleSubmit,
        handleDelete,
        setTitle,
        setText,
        setSelectedIds,
    };
};

export default Handle;
