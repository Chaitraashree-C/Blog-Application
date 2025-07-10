export const categories = ["Education", "Entertainment", "Food", "Technology", "Travel"]

const CategorySelect = ({ value, onChange }) => (
  <select className="form-control mb-2" value={value} onChange={onChange} required>
    <option value="">Select Category</option>
    {categories.map(c => <option key={c} value={c}>{c}</option>)}
  </select>
)

export default CategorySelect
