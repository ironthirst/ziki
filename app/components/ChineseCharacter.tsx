import React, { useRef, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { useDispatch } from "react-redux";

import { actions } from "../rx";
import { Button, TextInput } from "./Manta";

const Wrapper = styled.div`
  width: 90%;
  margin-left: auto;
  margin-right: auto;
  @media print {
    @page {
      size: landscape;
    }
  }
`;

function downloadFile(file: File) {
  // Create a link and set the URL using `createObjectURL`
  const link = document.createElement("a");
  link.style.display = "none";
  link.href = URL.createObjectURL(file);
  link.download = file.name;

  // It needs to be added to the DOM so it can be clicked
  document.body.appendChild(link);
  link.click();

  // To make this work on Firefox we need to wait
  // a little while before removing it.
  setTimeout(() => {
    URL.revokeObjectURL(link.href);
    link.parentNode.removeChild(link);
  }, 0);
}

export function ChineseCharacter() {
  const dispatch = useDispatch();
  const [text, setText] = useState("");

  return (
    <Wrapper>
      <div className="p-2">
        <TextInput
          required
          label="欲練習的字"
          hint="最多六個字"
          value={text}
          onValueChanged={setText}
        />
        <Button
          primary
          onClick={async () => {
            const cleanedText = text.trim();
            if (!cleanedText.length) {
              dispatch(actions.modal.error("請輸入欲練習的字"));
              return;
            }

            const pattern = /^[\u3000\u3400-\u4DBF\u4E00-\u9FFF]{1,6}$/;
            if (!pattern.test(cleanedText)) {
              dispatch(actions.modal.error("請輸入最多6個中文字"));
              return;
            }

            const params = new URLSearchParams();
            params.append("radio", "radio2"); // more columns
            params.append("textfield", text); // text to be printed
            params.append("lang", "zh_TW"); // required
            params.append("sid", "1234"); // field required, value does not matter
            params.append("csrfPreventionSalt", "null"); // field required
            params.append("print", "下載練習簿"); // field / value required

            console.log(params.toString());
            const res = await axios.post(
              "https://stroke-order.learningweb.moe.edu.tw/download.do",
              params,
              {
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded",
                },
                responseType: "blob",
              }
            );

            downloadFile(new File([res.data], `筆順練習-${text}.pdf`));
          }}
        >
          下載練習本
        </Button>
      </div>
    </Wrapper>
  );
}
