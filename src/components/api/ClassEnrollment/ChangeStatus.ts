import axios from 'axios';

const ChangePaymentStatus = async (token: string, body: any) => {
  const config = {
    headers: {
      jtoken: token,
    },
  };
  try {
    const { data, status } = await axios.patch(
      `${process.env.REACT_APP_HOST}user/classEnrollment`,
      body,
      config,
    );

    return { data, status };
  } catch (error) {
    return (error as any).response;
  }
};

export default ChangePaymentStatus;
