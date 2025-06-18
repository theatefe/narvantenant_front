import axios from 'axios';

const GetAllStudentPayments = async (token: string, classEnrollmentId: number) => {
  const config = {
    headers: {
      jtoken: token,
    },
  };
  try {
    const { data, status } = await axios.get(
      `${process.env.REACT_APP_HOST}user/payment/studentPaymentList/${classEnrollmentId}`,
      config,
    );
    return { data, status };
  } catch (error) {
    return (error as any).response;
  }
};

export default GetAllStudentPayments;
