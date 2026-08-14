export default function Input({
  svg,
  type = "text",
  placeholder,
  name,
  value,
  onChange,
  error,
}) {
  return (
    <div>
      {/* <label className="block text-sm font-medium text-gray-700 mb-1">
        {placeholder}
      </label> */}
      <div
        className={`flex items-center border rounded-md px-3 py-2 ${
          error ? "border-red-500" : "border-gray-300"
        } bg-white`}
      >
        <span className="text-gray-400 mr-2">{svg}</span>
        <input
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="flex-1 outline-none text-gray-700"
        />
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
