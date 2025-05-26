import axios from 'axios';

const Login = async (
  mobile: string,
  nationalCode: string,
) => {
  try {
    const { data, status } = await axios.post(
      `${process.env.REACT_APP_HOST}user`,
      {
        mobile,
        nationalCode,
        fireBaseToken: 'string',
      },
    );

    return { data, status };
  } catch (error) {
    return (error as any).response;
  }
};

export default Login;
