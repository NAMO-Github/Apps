import * as Yup from 'yup';

export enum SET_NFT_FOR_RENT_FIELDS {
  DURATION = 'duration',
  PRICE = 'price',
  UNIT = 'unit',
}

export const MAX_VALUE = 100000000;
export const VALIDATE_MESSAGE = {
  REQUIRED_DURATION:
    'This field is required. Please choose the rental duration for NFT',
  REQUIRED_PRICE: 'This field is required. Please enter the price for NFT',
  INVALID_AMOUNT:
    'You have entered an invalid amount. Please enter a valid number.',
  MAX_DECIMAL_DIGITS:
    'The amount cannot have precision greater than 18 decimal places. The system will block when users enter 19th decimal places.',
  MAX_VALUE:
    'The amount exceeds, the system will block when it exceeds 100,000,000',
};

const setNftForRentSchema = Yup.object().shape({
  packages: Yup.array().of(
    Yup.object().shape({
      duration: Yup.object({
        label: Yup.string().required(),
        value: Yup.string().required('Duration is required.'),
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
        ),
    })
  ),
});

export const setNftForRentSchemaWeb = Yup.object().shape({
  packages: Yup.array().of(
    Yup.object().shape({
      duration: Yup.string().required(VALIDATE_MESSAGE.REQUIRED_DURATION),
      price: Yup.number()
        .required(VALIDATE_MESSAGE.REQUIRED_PRICE)
        .transform((val) => (val ? +val : 0))
        .typeError(VALIDATE_MESSAGE.INVALID_AMOUNT)
        .positive(VALIDATE_MESSAGE.INVALID_AMOUNT)
        .test(
          SET_NFT_FOR_RENT_FIELDS.PRICE,
          VALIDATE_MESSAGE.MAX_VALUE,
          (number) => !!number && number <= MAX_VALUE
        ),
    })
  ),
});

export default setNftForRentSchema;
