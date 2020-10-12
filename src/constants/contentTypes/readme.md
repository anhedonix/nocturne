# Content Types

These are the different content types defined on the site.

To create a new content type, use the following format.

```javascript
const content = {
  ID: 'The unique name of the content, same as the object name',

  label: 'Label used to show to content to user',

  token: 'type:path0/path1/path2 - how to access the content.',

  // types can be of the following kind:
  // collection - Involves an entire collection of objects, these cannot be created.
  // doc - Single document in a collection
  // field - Single field in a document of a collection
  // metaField - A Seperate field that does not follow normal structure.

  // Extra properties of the content type.
  icon: 'React element representing icon for this content type.',

  adminURL: 'url:id / url - path that handles this content.',

  // Structure of the content type
  fields: [
  { id: 'uid - ID used to store this content in the database',
    label: 'string - What this field is labeled as',
    editable: 'bool - Can this field be edited by an Admin?',
    type: 'string/bool/int/timestamp/content - Type of content
            that this field represents.' },
    content: 'content - a content object that this field
            represents, used only when this field is of type
            content.'
  ],

  // Different ways to format the content
  format: {
    default: () => {'Default content will all fields defined.'},
    contentList: () => {'Format content for List
                          Header
                          Detail
                          Meta1
                          Meta2
                          Prefix
                          Suffix
                        '},
    preview: () => {'Format content for display.'},
    preSave: () => {'Format and check content before saving.'}
  },

  // Different actions that can be performed on the content.
  actions: [{
    label: 'Name of the action - shown to user',
    icon: 'React element icon - optional',
    type: 'button/dropdown - type of interface',
    function: 'Function to be run', // for buttons only
    items: [{ // for dropdown items only
      label: 'Name of the action',
      icon: 'React element icon - required',
      function: 'function to be called.'
    }]
  }],

  // CRUD
  create: () => {} // Create new content online
  read: () => {} // Read/Get content
  // Read/Get content snapshot - Dynamic content update
  readSnap: (callback) => { callback(); return unsubscribe }
  update: (uid, payload) => {} // Update Content
  delete: (uid) => {} // Delete Content
}

```
