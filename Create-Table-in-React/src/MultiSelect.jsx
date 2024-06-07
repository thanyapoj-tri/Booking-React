import Select from "react-select";

const MultiSelect= () => {
    const option =[
        { value: "jack", label: "Jack"},
        { value: "john", label: "John"},
        { value: "mike", label: "Mike"},
    ];
    const handleChange = (selectedOption) => {
        console.log("handleChange", selectedOption);
    };
    return <Select option={option} onChange={handleChange} isMulti />
};

export default MultiSelect;