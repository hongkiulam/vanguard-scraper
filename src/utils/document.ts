// Document Selectors
const dataReactId = (selector: string) => `[data-reactid='${selector}']`;
export const ISAVALUE = dataReactId(".0.1:0:3.1.1:1.1:0.1:0.1.0.1.0.1.0.1.0");
export const RATEOFRETURN = dataReactId(
  ".0.1:0:3.1.1:1.1:0.1:1.1.3.0.1.2.2.0.1.0.1.0.0"
);
export const PERFORMANCEBUTTON = dataReactId(
  ".0.1:0:3.1.1:1.1:0.1:1.1.3.0.1.2.2.0.1.1.0"
);
export const INVESTMENTSRETURNED = dataReactId(
  ".0.1:0:3.1.1:1.1:0.1:1.1.2.0.1:3.1:0.1.0.2.1.0"
);
export const USERNAMEINPUT = "#__GUID_1007";
export const PASSWORDINPUT = "#__GUID_1008";
export const LOGINBUTTON = dataReactId(".0.1:2.0.0.1.0.1:3.1.2.0");

// Others
export const getTextContent = (el: Element) => {
  return el.textContent;
};
