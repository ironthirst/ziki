import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";

import { actions } from "../rx";
import { Button, TextInput } from "./Manta";
import { downloadFile } from "../lib/util";
import { PageWrapper } from "./common/PageWrapper";

export function ChineseCharacter() {
  const dispatch = useDispatch();
  const [text, setText] = useState("");

  return (
    <PageWrapper landscape>
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

            const headers = {
              "Content-Type": "application/x-www-form-urlencoded",
            };

            const res = await axios.post(
              "https://stroke-order.learningweb.moe.edu.tw/download.do",
              params,
              {
                headers,
                responseType: "blob",
              }
            );

            downloadFile(new File([res.data], `筆順練習-${text}.pdf`));
          }}
        >
          下載練習本
        </Button>
      </div>
    </PageWrapper>
  );
}
