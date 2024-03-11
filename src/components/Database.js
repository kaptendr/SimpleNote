import Realm from "realm";

class NoteSchema extends Realm.Object {}

NoteSchema.schema = {
  name: 'Note',
  primaryKey: 'id',
  properties: {
    id: 'int',
    desc: 'string',
    date: 'date?'
  }
};

let realm = new Realm({ schema: [NoteSchema], schemaVersion: 2 });

let getAllNotes = () => {
  return realm.objects('Note').sorted("date", true);
}

let getNoteById = (_id) => {
  return realm.objects('Note').filtered(`id == ${_id}`)
}

let addNote = (_desc = null) => {

  let checkId = realm.objects('Note').max('id');

  realm.write(() => {
    const note = realm.create('Note', {
      id: (checkId == null) ? 1 : checkId + 1,
      desc: _desc,
      date: new Date()
    });
  });
}

let updateNote = (id, _desc = null) => {
  realm.write(() => {
    let alpha = getNoteById(id)[0];
    alpha.desc = _desc,
    alpha.date = new Date()
  });
}

let deleteNote = (key) => {
  realm.write(() => {
    let alpha = getNoteById(key);
    realm.delete(alpha);
  });
}

export default realm;

export {
  getAllNotes,
  addNote,
  updateNote,
  deleteNote,
}