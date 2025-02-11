const { nanoid } = require('nanoid');
const notes = require('./notes');

// ADD NEW NOTES
const addNoteHandler = (request, h) => {
  const { title, tags, body } = request.payload; // load data from client
  const id = nanoid(16); // automate id generated


  const createdAt = new Date().toISOString(); // Create created datetime string
  const updatedAt = createdAt; // Create updated datetime string

  const newNote = {
    title, tags, body, id, createdAt, updatedAt,
  };

  // Add new note to notes array data
  notes.push(newNote);

  // Check if success or not added new note
  const isSuccess = notes.filter((note) => note.id === id).length > 0;

  // Response if note success added
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Note added successfully',
      data: {
        noteId: id,
      },
    });

    response.code(201);
    return response;
  };

  // Response if note failed to added
  const response = h.response({
    status: 'fail',
    message: 'Note failed to added',
  });

  response.code(500);
  return response;
};

// GET ALL NOTES
const getAllNotesHandler = () => ({
  status: 'success',
  data: {
    notes,
  },
});

// GET NOTE DETAILS
const getNoteByIdHandler = (request, h) => {
  const { id } = request.params;

  const note = notes.filter((note) => note.id === id)[0];

  if (note !== undefined) {
    return {
      status: 'success',
      data: {
        note,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Cannot find the note.',
  });

  response.code(404);
  return response;
};

// UPDATE NOTE BY ID
const editNoteByIdHandler = (request, h) => {
  const { id } = request.params;

  const { title, tags, body } = request.payload;

  const index = notes.findIndex((note) => note.id === id);
  const updatedAt = new Date().toISOString();

  if (index !== -1) {

    // update note
    notes[index] = {
      ...notes[index],
      title, tags, body, updatedAt,
    };

    // send response to client
    const response = h.response({
      status: 'success',
      message: 'Note updated successfully'
    });

    response.code(200);
    return response;
  };

  // if index not found
  const response = h.response({
    status: 'fail',
    message: 'Failed to update note. Note id is not found!',
  });

  response.code(404);
  return response;
};

// DELETE NOTE BY ID
const deleteNoteByIdHandler = (request, h) => {
  const { id } = request.params;

  const index = notes.findIndex((note) => note.id === id);

  if (index !== -1) {
    notes.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Note deleted Successfully',
    });

    response.code(200);
    return response;
  };

  const response = h.response({
    status: 'fail',
    message: 'Failed to delete the note, Note id is not found!'
  });

  response.code(404);
  return response;
};

// EXPORT MODULES
module.exports = {
  addNoteHandler,
  getAllNotesHandler,
  getNoteByIdHandler,
  editNoteByIdHandler,
  deleteNoteByIdHandler
};