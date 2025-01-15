
const mongoose= require("mongoose")



const SectionSchema = mongoose.Schema({
    name: { type: String, required: true },       // e.g., "A", "B", etc.
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Allclasses', required: true },  // Reference to the Class model
    // Additional section details...
  });
  
  const Section = mongoose.model('Section', SectionSchema);
  module.exports = Section;
  


  // s, you’re correct! In the setup you described, the relationships are managed by storing individual entities (Teacher, Class, Section, and Subject) 
  // in their own collections  and then linking them through references in a central TeachingAssignment collection.
  //  This type of relationship is commonly referred to as a "many-to-many relationship
  //  with an intermediary model" or "junction table" (in relational databases).