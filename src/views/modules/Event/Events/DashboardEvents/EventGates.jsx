import React, { useState, Fragment, useEffect, useCallback } from "react";
import { Modal, Form, Button, Table, Spinner } from "react-bootstrap";
import { Pencil, Trash2 } from "lucide-react";
import { useMyContext } from "../../../../../Context/MyContextProvider";
import axios from "axios";
import Swal from "sweetalert2";

const EventGates = ({ show, id, setShow, setModalId, isAreaModal }) => {
  const { api, UserData, authToken, successAlert } = useMyContext();
  const [gates, setGates] = useState([]);
  const [gateForm, setGateForm] = useState({ title: "", description: "" });
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);

  // Helper function to fetch gates
  const getGates = useCallback(async () => {
    try {
      const url = isAreaModal
        ? `${api}accessarea-list/${id}`
        : `${api}event-gate-list/${id}`;
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setGates(res.data.data || []);
    } catch {
      setGates([]);
    }
  }, [api, id, authToken]);

  useEffect(() => {
    if (show && id) {
      getGates();
    }
  }, [show, id, api, authToken, getGates]);

  const handleGateFormChange = (e) => {
    const { name, value } = e.target;
    setGateForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGateFormSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false || !gateForm.title.trim()) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    try {
      setLoading(true);
      const Gateurl = editId
        ? `${api}event-gate-update/${editId}`
        : `${api}event-gate-store`;
      const AreaUrl = editId
        ? `${api}accessarea-update/${editId}`
        : `${api}accessarea-store`;
      const url = isAreaModal ? AreaUrl : Gateurl;
      const payload = {
        user_id: UserData?.id,
        event_id: id,
        title: gateForm.title,
        description: gateForm.description,
      };

      await axios.post(url, payload, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      await getGates(); // Refresh gates list
    } catch (err) {
      console.error("Failed to save gate:", err);
      // Optional: Show user feedback or retry
    } finally {
      setGateForm({ title: "", description: "" });
      setEditId(null);
      setValidated(false);
      setLoading(false);
    }
  };

  const handleEdit = (gate) => {
    setGateForm({ title: gate.title, description: gate.description });
    setEditId(gate.id);
  };

  const handleCloseGateModal = () => {
    setShow(false);
    setModalId(null);
    setGateForm({ title: "", description: "" });
    setGates([]);
    setValidated(false);
    setEditId(null);
  };

  const handleDelete = async (gateId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You will not be able to recover this ${
        isAreaModal ? "access area" : "gate"
      }!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });
    if (result.isConfirmed) {
      try {
        const url = isAreaModal
          ? `${api}accessarea-destroy/${gateId}`
          : `${api}event-gate-destroy/${gateId}`;
        await axios.delete(url, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        await getGates();
        // Swal.fire("Deleted!", "Gate has been deleted.", "success");
        successAlert(
          `${
            isAreaModal ? "Access Area" : "Gate"
          } has been deleted successfully.`
        );
      } catch (err) {
        Swal.fire(
          "Error!",
          `Failed to delete ${isAreaModal ? "Access Area" : "Gate"}.`,
          "error"
        );
      }
    }
  };

  return (
    <Fragment>
      <Modal show={show} onHide={handleCloseGateModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            Manage {isAreaModal ? "Access Area" : "Gates"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            noValidate
            validated={validated}
            onSubmit={handleGateFormSubmit}
          >
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={gateForm.title}
                onChange={handleGateFormChange}
                required
                isInvalid={validated && !gateForm.title.trim()}
              />
              <Form.Control.Feedback type="invalid">
                Title is required.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={gateForm.description}
                onChange={handleGateFormChange}
              />
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              className="float-end mb-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  {editId
                    ? `Updating ${isAreaModal ? "Access Area" : "Gate"}...`
                    : `Adding ${isAreaModal ? "Access Area" : "Gate"}...`}
                </>
              ) : editId ? (
                `Update ${isAreaModal ? "Access Area" : "Gate"}`
              ) : (
                `Add ${isAreaModal ? "Access Area" : "Gate"}`
              )}
            </Button>
          </Form>
          <hr />
          <h6>Gates List</h6>
          <Table striped bordered hover size="sm">
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Description</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {gates.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center">
                    No gates added yet.
                  </td>
                </tr>
              ) : (
                gates.map((gate, idx) => (
                  <tr key={gate.id}>
                    <td>{idx + 1}</td>
                    <td>{gate.title}</td>
                    <td>{gate.description}</td>
                    <td>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-2 p-1"
                        style={{ lineHeight: 0 }}
                        onClick={() => handleEdit(gate)}
                      >
                        <Pencil size={16} />
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        className="p-1"
                        style={{ lineHeight: 0 }}
                        onClick={() => handleDelete(gate.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Modal.Body>
      </Modal>
    </Fragment>
  );
};

export default EventGates;
