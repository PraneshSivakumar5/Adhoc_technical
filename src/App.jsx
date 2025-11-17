import { useState, useEffect } from "react";

function App() {
  const [form, setForm] = useState({
    name: "",
    age: "",
    gmail: "",
    color: "#ffffff",
  });

  const [tableData, setTableData] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("tableData");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
      
        const withShowFlag = parsed.map((row) => ({
          showColor: false,
          ...row,
        }));
        setTableData(withShowFlag);
      } catch (err) {
        console.error("Error parsing saved data", err);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tableData", JSON.stringify(tableData));
  }, [tableData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setForm({
      name: "",
      age: "",
      gmail: "",
      color: "#ffffff",
    });
    setEditingId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.age || !form.gmail) return;

    if (editingId === null) {
      const newRow = {
        id: Date.now(),
        ...form,
        showColor: false, 
      };
      setTableData((prev) => [...prev, newRow]);
    } else {
      setTableData((prev) =>
        prev.map((row) =>
          row.id === editingId
            ? {
                ...row, 
                ...form,
              }
            : row
        )
      );
    }

    resetForm();
  };

  const handleDelete = (id) => {
    setTableData((prev) => prev.filter((row) => row.id !== id));

    if (editingId === id) {
      resetForm();
    }
  };

  const handleEdit = (row) => {
    setForm({
      name: row.name,
      age: row.age,
      gmail: row.gmail,
      color: row.color || "#ffffff",
    });
    setEditingId(row.id);
  };


  const handleToggleRowColor = (id) => {
    setTableData((prev) =>
      prev.map((row) =>
        row.id === id
          ? { ...row, showColor: !row.showColor }
          : row
      )
    );
  };

  return (
    <div style={{ padding: "20px" }}>
     
      <h1>Adhoc User Input</h1>
      <h3>All rights reserved. ADHOC SOFTWARES.inc</h3>

      {editingId !== null && (
        <p style={{ color: "orange" }}>Editing existing row...</p>
      )}

      <form onSubmit={handleSubmit} style={{ marginBottom: "16px" }}>
        <input
          name="name"
          placeholder="Name :"
          value={form.name}
          onChange={handleChange}
          style={{ marginRight: "8px" }}
        />

        <input
          name="age"
          placeholder="Age :"
          value={form.age}
          onChange={handleChange}
          style={{ marginRight: "8px" }}
        />

        <input
          name="gmail"
          placeholder="Gmail :"
          value={form.gmail}
          onChange={handleChange}
          style={{ marginRight: "8px" }}
        />

        <input
          type="color"
          name="color"
          value={form.color}
          onChange={handleChange}
          style={{ marginRight: "8px" }}
        />

        <button type="submit">
          {editingId === null ? "Submit" : "Update"}
        </button>

        {editingId !== null && (
          <button
            type="button"
            onClick={resetForm}
            style={{ marginLeft: "8px" }}
          >
            Cancel
          </button>
        )}
      </form>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Sl.No</th>
            <th>Name</th>
            <th>Age</th>
            <th>Gmail</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {tableData.map((row, index) => (
            <tr
              key={row.id}
              style={{
                
                backgroundColor: row.showColor
                  ? row.color || "transparent"
                  : "transparent",
              }}
            >
              <td>{index + 1}</td>
              <td>{row.name}</td>
              <td>{row.age}</td>
              <td>{row.gmail}</td>
              <td>
               
                <button
                  onClick={() => handleToggleRowColor(row.id)}
                  style={{ marginRight: "6px" }}
                >
                  {row.showColor ? "Hide Color" : "Show Color"}
                </button>

                <button onClick={() => handleEdit(row)}>Edit</button>
                <button
                  onClick={() => handleDelete(row.id)}
                  style={{ marginLeft: "6px" }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}

          {tableData.length === 0 && (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                No data yet
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;
