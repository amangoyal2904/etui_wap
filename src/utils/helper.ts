
export const removeBackSlash = val => {
  val = val && typeof val != "object" ? val.replace(/\\/g, "") : "";
  return val;
};

export default {removeBackSlash};