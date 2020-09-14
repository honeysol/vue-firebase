import { ValidationProvider, ValidationObserver, extend } from "vee-validate";
import { required, email } from "vee-validate/dist/rules";

extend("email", {
  ...email,
  message: "Invalid email format"
});
extend("required", {
  ...required,
  message: "This field is required"
});

export const form = {
  components: { ValidationProvider, ValidationObserver }
};
