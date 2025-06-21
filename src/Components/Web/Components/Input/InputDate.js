import { useEffect, useState } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

const InputDate = ({ value, setValue, ...props }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    setData(value ? (dayjs(value).isValid() ? dayjs(value) : dayjs()) : null);
  }, [value]);

  return (
    <DatePicker
      value={data ? dayjs(data) : data}
      onChange={(newValue) => {
        setData(newValue ? dayjs(newValue) : newValue);
        newValue
          ? dayjs(newValue).isValid() &&
            setValue(dayjs(newValue).format("YYYY-MM-DD"))
          : setValue("");
      }}
      format="DD/MM/YYYY"
      {...props}
    />
  );
};

export default InputDate;
