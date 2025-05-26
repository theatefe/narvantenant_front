import axios from 'axios';

const ForgetPasswordApi = async (mobile: string) => {
  try {
    const { data, status } = await axios.put(
      `${process.env.REACT_APP_HOST}company/forgetPass`,
      {
        mobile,
      },
    );
    return { data, status };
  } catch (error) {
    return (error as any).response;
  }
};

export default ForgetPasswordApi;
