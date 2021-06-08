import React, { useEffect, ReactNode } from "react";
import $ from "jquery";
import "bootstrap/js/dist/modal";

type Props = {
  isOpen: boolean;
  onClose?: () => void;
  title?: string;
  footer?: ReactNode;
  id: string;
  size?: "lg" | "sm" | "xl";
} & React.HTMLProps<HTMLDivElement>;

export function Modal(props: Props) {
  const { isOpen, size, onClose, title, footer, id } = props;

  useEffect(() => {
    $(`#${id}`).modal(isOpen ? "show" : "hide");
  }, []);

  useEffect(() => {
    $(`#${id}`).modal(isOpen ? "show" : "hide");
    $(`#${id}`).on("hidden.bs.modal", function () {
      if (onClose) onClose();
    });
  }, [isOpen]);

  return (
    <div id={id} className={"modal fade"} role="dialog">
      <div role="document" className={`modal-dialog modal-${size}`}>
        <div className="modal-content">
          {title && onClose ? (
            <div className="modal-header">
              {title ? <h5 className="modal-title">{title}</h5> : null}
              {onClose ? (
                <button className="close" onClick={onClose}>
                  <span>&times;</span>
                </button>
              ) : null}
            </div>
          ) : null}
          <div className="modal-body">{props.children}</div>
          {!footer ? null : <div className="modal-footer">{footer}</div>}
        </div>
      </div>
    </div>
  );
}
