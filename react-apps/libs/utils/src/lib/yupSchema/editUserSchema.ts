import { SET_NFT_FOR_RENT_FIELDS, MAX_VALUE } from './setNftForRentSchema';
import * as Yup from 'yup';

// const schemaLinkWeb = Yup.string()
//   .transform((link) => `${link || ''}`.toLowerCase())
//   .matches(
//     rxWebsite,
//     'You have entered an invalid link, please enter a valid link. For example: “http://abc”'
//   );

const editUserSchema = Yup.object().shape({
  name: Yup.string().required(
    'This field is required. Please enter your name.'
  ),
  userName: Yup.string().required(
    'This field is required. Please enter your username.'
  ),
  bio: Yup.string(),
  email: Yup.string()
    .email(
      'You have entered an invalid email address. Please enter a valid email address. For example: abc@domain.com'
    )
    .required('This field is required. Please enter your email.'),
  // tiktok: schemaLinkWeb,
  // twitter: schemaLinkWeb,
  // instagram: schemaLinkWeb,
  // facebook: schemaLinkWeb,
});

const VALIDATE_MESSAGE = {
  REQUIRED_DURATION: 'Duration is required.',
  REQUIRED_PRICE: 'This field is required. Please enter the price for NFT',
  INVALID_AMOUNT:
    'You have entered an invalid amount. Please enter a valid number.',
  MAX_DECIMAL_DIGITS:
    'Please enter a valid number. The amount cannot have precision greater than 8 decimal places.',
  MAX_VALUE:
    'Please enter a valid number. The amount cannot exceed 100,000,000.',
};

export const setNftForRentSchema = Yup.object().shape({
  packages: Yup.array().of(
    Yup.object().shape({
      duration: Yup.object({
        label: Yup.string().required(),
        value: Yup.string().required(VALIDATE_MESSAGE.REQUIRED_DURATION),
      }),
      price: Yup.number()
        .required(VALIDATE_MESSAGE.REQUIRED_PRICE)
        .transform((val) => (val ? +val : 0))
        .typeError(VALIDATE_MESSAGE.INVALID_AMOUNT)
        .positive(VALIDATE_MESSAGE.INVALID_AMOUNT)
        .test(
          SET_NFT_FOR_RENT_FIELDS.PRICE,
          VALIDATE_MESSAGE.MAX_VALUE,
          (number) => !!number && number <= MAX_VALUE
        )
        .test({
          test(value, ctx) {
            const str = value?.toString();
            const afterComma = str?.substr(str.indexOf('.') + 1);
            if (afterComma) {
              if (afterComma.length > 8) {
                return ctx.createError({
                  message: VALIDATE_MESSAGE.MAX_DECIMAL_DIGITS,
                });
              }
            }
            return true;
          },
        }),
    })
  ),
});

export default editUserSchema;
