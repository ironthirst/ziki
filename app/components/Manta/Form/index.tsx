import React, {
  FunctionComponent,
  useState,
  useEffect,
  useRef,
  ReactNode,
} from "react";
import styled from "styled-components";
import marked from "marked";
import moment, { Moment } from "moment-timezone";

import { Clickable } from "../Clickable";

export * from "./Button";

// validator should return an error message string on validation failure, and return a null or empty string
// on success
type ValueValidator<T> = (value: T) => string | null;

function ValidationHint<T = string>(opt: {
  value: T;
  required?: boolean;
  validate?: ValueValidator<T>;
}) {
  const { value, required, validate } = opt;
  let errorMessage = "";
  if (required && !value) {
    errorMessage = "此欄位為必填";
  }
  if (validate && !errorMessage) {
    errorMessage = validate(value);
  }
  if (!errorMessage) return null;
  return (
    <>
      <small className="text-danger">{errorMessage}</small>
      <br />
    </>
  );
}

// two commonly used validator implementations
export const numericValidator =
  (opt: { min?: number; max?: number; isInteger?: boolean }) => (s: string) => {
    const { min, max, isInteger } = opt;
    if (s.length === 0) return "";
    const n = parseInt(s);
    if (!Number.isFinite(n)) return "請輸入一個數字";
    if (isInteger !== undefined && !Number.isInteger(n) && isInteger)
      return "請輸入一個整數";
    if (Number.isFinite(min) && n < min) return `請輸入一個大於 ${min} 的數字`;
    if (Number.isFinite(max) && n > max) return `請輸入一個大於 ${max} 的數字`;
    return "";
  };

export const greaterThanZeroIntegerValidator = numericValidator({
  min: 0,
  isInteger: true,
});

export const dateValidator =
  (opt: { format: string; timezone?: string }) => (s: string) => {
    const { format, timezone = "UTC" } = opt;
    const d = moment.tz(s, format, timezone);
    if (d.isValid()) return "";
    return "不正確的日期格式";
  };

const Hint: FunctionComponent = (props) => {
  return <small className="text-muted">{props.children}</small>;
};

type FormInputType<T = string> = {
  label?: string;
  hint?: string | JSX.Element;
  placeholder?: string;
  value: T;
  required?: boolean;
  warn?: boolean;
  onValueChanged?: (value: T) => void;
};

type FileSelectorProps = {
  label: string;
  mimeType?: string;
  block?: boolean;
  onFilesChanged: (files: File[]) => void;
};

type TagListProps = {
  color?: string; // bootstrap color tag. i.e. primary
  onDeleteTag?: (tag: string) => void;
  placeholder?: string;
};

export function TagList(props: FormInputType<string[]> & TagListProps) {
  const {
    label,
    value,
    color = "primary",
    onDeleteTag,
    placeholder = "無",
    onValueChanged,
  } = props;

  const [isDirectEditing, setIsDirectEditing] = useState(false);
  const [editingText, setEditingText] = useState("");
  useEffect(() => {
    setEditingText(value.join(", "));
  }, [value]);

  function endDirectEditing() {
    setIsDirectEditing(false);
    onValueChanged(editingText.split(",").map((n) => n.trim()));
  }

  return (
    <div className="form-group">
      {label ? <label>{label}</label> : null}
      {isDirectEditing ? (
        <input
          ref={(node) => {
            if (node) node.focus();
          }}
          type="text"
          className="form-control"
          value={editingText}
          onChange={(e) => setEditingText(e.target.value)}
          onBlur={() => endDirectEditing()}
          onKeyPress={(e) => {
            if (e.key !== "Enter") return;
            endDirectEditing();
          }}
        />
      ) : (
        <div onClick={() => setIsDirectEditing(onValueChanged ? true : false)}>
          {value.length === 0 ? (
            <div style={{ paddingTop: "4px" }}>{placeholder}</div>
          ) : (
            <span style={{ fontSize: "1.2rem" }}>
              {value.map((t, i) => (
                <span key={i} className={`badge badge-${color} mr-1`}>
                  {" "}
                  {t} &nbsp;
                  {!onDeleteTag ? null : (
                    <Clickable onClick={() => onDeleteTag(t)}>
                      <i className="fa fa-times text-white" />
                    </Clickable>
                  )}
                </span>
              ))}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export function FileSelector(props: FileSelectorProps) {
  const { label, block = true, mimeType = "*/*", onFilesChanged } = props;
  const el = useRef<HTMLInputElement>();
  const classNames = ["btn", "btn-primary"];
  if (block) classNames.push("btn-block");
  return (
    <label className={classNames.join(" ")} style={{ margin: 0 }}>
      {label}{" "}
      <input
        type="file"
        accept={mimeType}
        style={{ display: "none" }}
        onChange={(e) => {
          onFilesChanged([...Array.from(e.target.files)]);
        }}
      />
    </label>
  );
}

export function Static(
  props: { label?: string; hint?: string } & React.HTMLProps<HTMLDivElement>
) {
  const { children, className, label, hint, ...rest } = props;
  return (
    <div className={`form-group ${className}`} {...rest}>
      {label ? <label>{label}</label> : null}
      <div>{children}</div>
      <Hint>{hint}</Hint>
    </div>
  );
}

type TextInputProps = {
  readOnly?: boolean;
  validate?: ValueValidator<string>;
};

const BorderedInput = styled.input<{ warn?: boolean }>`
  border-color: ${(props) =>
    props.warn ? props.theme.colors.warning : "default"};
`;

const BorderedSelect = styled.select<{ warn?: boolean }>`
  border-color: ${(props) =>
    props.warn ? props.theme.colors.warning : "default"};
`;

export function TextInput(
  props: FormInputType &
    TextInputProps & { secured?: boolean; onBlur?: () => void }
) {
  const {
    placeholder,
    readOnly,
    value,
    secured,
    hint,
    label,
    required,
    warn,
    onBlur,
    validate,
    onValueChanged,
  } = props;

  return (
    <div className="form-group">
      {required ? <span className="text-danger">*</span> : null}
      {label ? <label>{label}</label> : null}
      <BorderedInput
        type={secured ? "password" : "text"}
        className="form-control"
        placeholder={placeholder}
        readOnly={readOnly}
        value={value}
        onBlur={onBlur}
        warn={
          warn ||
          (required && !value) ||
          (validate ? validate(value).length > 0 : false)
        }
        onChange={(e) => onValueChanged(e.target.value)}
      />
      <ValidationHint value={value} required={required} validate={validate} />
      <Hint>{hint}</Hint>
    </div>
  );
}

const MarkDownPreview = styled.div`
  border: 1px solid #888;
  border-radius: 5px;
  padding: 5px;
`;

export function TextArea(
  props: FormInputType & TextInputProps & { asMarkDown?: boolean }
) {
  const {
    placeholder,
    value,
    hint,
    label,
    asMarkDown,
    validate,
    required,
    readOnly,
    onValueChanged,
  } = props;

  const labelNode = label ? <label>{label}</label> : null;

  const textAreaNode = (
    <textarea
      className="form-control"
      placeholder={placeholder}
      value={value}
      rows={10}
      readOnly={readOnly}
      onChange={(e) => onValueChanged(e.target.value)}
    />
  );

  const markDownNode = (
    <MarkDownPreview
      className="form-control"
      dangerouslySetInnerHTML={{ __html: marked(value) }}
    />
  );

  if (!asMarkDown) {
    return (
      <div className="form-group">
        {labelNode}
        {textAreaNode}
        <Hint>{hint}</Hint>
      </div>
    );
  } else {
    return (
      <div className="form-group">
        {labelNode}
        <div className="row">
          <div className="col col-6">{textAreaNode}</div>
          <div className="col col-6">{markDownNode}</div>
        </div>
        {asMarkDown ? (
          <Hint>
            支援{" "}
            <a target="_blank" href="https://markdown.tw/">
              MarkDown 語法
            </a>
          </Hint>
        ) : null}
        <ValidationHint value={value} required={required} validate={validate} />
        <Hint>{hint}</Hint>
      </div>
    );
  }
}

type OptionsProps = {
  options: { value: string; label?: string | ReactNode }[];
};

type RenderOptionProp = {
  renderOption: (opt: {
    option: OptionsProps["options"][0];
    checked: boolean;
  }) => JSX.Element;
};

export function CheckBoxGroup(
  props: FormInputType<string[]> &
    OptionsProps & {
      groupName: string;
    } & Partial<RenderOptionProp>
) {
  const {
    label,
    hint,
    value,
    onValueChanged,
    options,
    groupName,
    renderOption,
    required,
  } = props;

  return (
    <div>
      {required ? <span className="text-danger">*</span> : null}
      {label ? <label>{label}</label> : null}
      <div className="form-group">
        <div className="form-check form-check-inline">
          {options.map((opt) => {
            const isChecked = value.indexOf(opt.value) >= 0;
            return (
              <label className="form-check-label mr-2" key={opt.value}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  name={groupName}
                  value={opt.value}
                  checked={isChecked}
                  onChange={() => {
                    onValueChanged(
                      isChecked
                        ? value.filter((v) => v !== opt.value)
                        : [...value, opt.value]
                    );
                  }}
                />{" "}
                {renderOption
                  ? renderOption({ option: opt, checked: isChecked })
                  : opt.label || opt.value}
              </label>
            );
          })}
        </div>
        <br />
        <Hint>{hint}</Hint>
      </div>
    </div>
  );
}

export function TimeRangeSelector(
  props: FormInputType<string[]> & { granularity: "hour" | "half-hour" }
) {
  const { value, hint, label, onValueChanged, granularity, required } = props;

  // generate options
  const options = [] as { label: string; value: string }[];
  const start = moment.tz("Asia/Taipei").startOf("day");
  const end = start.clone().add({ days: 1 });
  let offset = null;
  if (granularity === "hour") {
    offset = { minutes: 60 };
  } else if (granularity === "half-hour") {
    offset = { minutes: 30 };
  }
  const finger = start.clone();
  while (finger.isBefore(end)) {
    const value = `${finger.format("HH:mm")}`;
    options.push({ label: value, value });
    finger.add(offset);
  }

  const fromOptionIndex = options.findIndex((opt) => opt.value === value[0]);

  return (
    <div className="form-group">
      {required ? <span className="text-danger">*</span> : null}
      {label ? <label>{label}</label> : null}
      <div className="d-block">
        <select
          value={value[0]}
          className="form-control d-inline-block w-auto"
          onChange={(e) => onValueChanged([e.target.value, value[1]])}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label || opt.value}
            </option>
          ))}
        </select>
        &nbsp; ~&nbsp;
        <select
          value={value[1]}
          className="form-control d-inline-block w-auto"
          onChange={(e) => onValueChanged([value[0], e.target.value])}
        >
          {options.slice(fromOptionIndex).map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label || opt.value}
            </option>
          ))}
        </select>
      </div>
      <Hint>{hint}</Hint>
    </div>
  );
}

export function BinaryRadioGroup(
  props: FormInputType<boolean> & {
    groupName: string;
    trueLabel?: string;
    falseLabel?: string;
  } & Partial<RenderOptionProp>
) {
  const {
    label,
    hint,
    value,
    onValueChanged,
    groupName,
    trueLabel = "是",
    falseLabel = "否",
    renderOption,
  } = props;
  return (
    <RadioGroup
      label={label}
      groupName={groupName}
      hint={hint}
      value={`${value}`}
      renderOption={renderOption}
      options={[
        { label: trueLabel, value: "true" },
        { label: falseLabel, value: "false" },
      ]}
      onValueChanged={(s) => onValueChanged(s === "true")}
    />
  );
}

export function RadioGroup(
  props: FormInputType &
    OptionsProps & {
      groupName: string;
    } & Partial<RenderOptionProp>
) {
  const {
    label,
    hint,
    value,
    onValueChanged,
    options,
    groupName,
    renderOption,
  } = props;

  return (
    <div>
      {label ? <label>{label}</label> : null}
      <div className="form-group">
        <div className="form-check form-check-inline">
          {options.map((opt) => {
            return (
              <label className="form-check-label mr-2" key={opt.value}>
                <input
                  className="form-check-input"
                  type="radio"
                  name={groupName}
                  value={opt.value}
                  checked={value === opt.value}
                  onChange={(e) => onValueChanged(e.target.value)}
                />{" "}
                {renderOption
                  ? renderOption({ option: opt, checked: value === opt.value })
                  : opt.label || opt.value}
              </label>
            );
          })}
        </div>
        <br />
        <Hint>{hint}</Hint>
      </div>
    </div>
  );
}

type DropDownProps = FormInputType<string> &
  OptionsProps &
  React.HTMLProps<HTMLDivElement> & {
    noBottomMargin?: boolean;
  };

export function DropDown(props: DropDownProps) {
  const {
    label,
    hint,
    value,
    onValueChanged,
    options,
    ref,
    as,
    noBottomMargin,
    required,
    ...rest
  } = props;

  const classNames = ["form-group"];
  if (noBottomMargin) classNames.push("m-0");
  return (
    <div {...rest}>
      {required ? <span className="text-danger">*</span> : null}
      {label ? <label>{label}</label> : null}
      <div className={classNames.join(" ")}>
        <select
          value={value}
          className="form-control"
          onChange={(e) => onValueChanged(e.target.value)}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label || opt.value}
            </option>
          ))}
        </select>
        {hint ? (
          <>
            <br />
            <Hint>{hint}</Hint>
          </>
        ) : null}
      </div>
    </div>
  );
}

type DatePickerProps = FormInputType<Moment> & {
  format?: string;
};

const DayCell = styled.td<{ active?: boolean }>`
  background-color: ${(props) => (props.active ? "red" : "inherit")};
  color: ${(props) => (props.active ? "white" : "inherit")};
  cursor: pointer;
  text-align: center;
  padding-left: 0;
  padding-right: 0;
`;

export function DatePicker(props: DatePickerProps) {
  const {
    placeholder,
    value,
    hint,
    label,
    format = "YYYY/MM/DD",
    onValueChanged,
  } = props;

  return (
    <div className="form-group">
      {label ? <label>{label}</label> : null}
      <input
        type="text"
        className="form-control"
        placeholder={placeholder}
        readOnly
        value={value.format(format)}
      />
      <Calendar value={value} onValueChanged={onValueChanged} />
      <Hint>{hint}</Hint>
    </div>
  );
}

type DateRangePickerProps = FormInputType<Moment[]> & {
  format?: string;
};

export function DateRangePicker(props: DateRangePickerProps) {
  const {
    placeholder,
    value,
    hint,
    label,
    format = "YYYY/MM/DD",
    onValueChanged,
  } = props;

  if (value.length !== 2) return null;

  return (
    <div className="form-group">
      {label ? <label>{label}</label> : null}
      <div className="row">
        <div className="col-12 col-sm-6">
          <label>從</label>
          <input
            type="text"
            className="form-control"
            placeholder={placeholder}
            readOnly
            value={value[0].format(format)}
          />
          <Calendar
            value={value[0]}
            onValueChanged={(d) => onValueChanged([d, value[1]])}
          />
        </div>
        <div className="col-12 col-sm-6">
          <label>至</label>
          <input
            type="text"
            className="form-control"
            placeholder={placeholder}
            readOnly
            value={value[1].format(format)}
          />
          <Calendar
            value={value[1]}
            onValueChanged={(d) => onValueChanged([value[0], d])}
          />
        </div>
      </div>
      <Hint>{hint}</Hint>
    </div>
  );
}

function Calendar(props: {
  value: Moment;
  onValueChanged: (d: Moment) => void;
}) {
  const { value, onValueChanged } = props;

  const startOfMonth = value.clone().startOf("month");
  const endOfMonth = value.clone().endOf("month");

  // number of rows is number of days in month + first day's day of week
  const numberOfWeeks = Math.ceil((endOfMonth.date() + startOfMonth.day()) / 7);
  const rows: number[] = Object.keys(
    new Array(numberOfWeeks).fill(undefined)
  ) as any;

  return (
    <table className="table table-bordered">
      <tbody>
        <tr>
          <td
            colSpan={7}
            className="p0 text-center"
            style={{ verticalAlign: "middle" }}
          >
            <Clickable
              className="float-left"
              onClick={() => onValueChanged(value.clone().add({ months: -1 }))}
            >
              <i className="fa fa-chevron-left" />
            </Clickable>
            <Clickable
              className="float-right"
              onClick={() => onValueChanged(value.clone().add({ months: 1 }))}
            >
              <i className="fa fa-chevron-right" />
            </Clickable>
            <strong>{startOfMonth.format("YYYY MMMM")}</strong>
          </td>
        </tr>
        <tr>
          <DayCell>日</DayCell>
          <DayCell>一</DayCell>
          <DayCell>二</DayCell>
          <DayCell>三</DayCell>
          <DayCell>四</DayCell>
          <DayCell>五</DayCell>
          <DayCell>六</DayCell>
        </tr>
        {rows.map((row) => (
          <tr key={row}>
            {[0, 1, 2, 3, 4, 5, 6].map((col) => {
              const days = row * 7 + col - startOfMonth.day();
              if (days < 0 || days > endOfMonth.date()) {
                return <DayCell key={col} />;
              }

              const d = startOfMonth.clone().add({ days });
              return (
                <DayCell
                  key={col}
                  active={d.isSame(value, "day")}
                  onClick={() => onValueChanged(d)}
                >
                  {d.date()}
                </DayCell>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
