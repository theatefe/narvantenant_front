import axios from 'axios';

const UploadFile = async (token, formData) => {
  const config = {
    headers: {
      jtoken: token,
      'Content-Type': 'multipart/form-data',
    },
  };
  try {
    const result = await axios.post(
      `${process.env.REACT_APP_HOST}commons/uploadFile`,
      formData,
      config,
    );
    return result;
  } catch (error) {
    return false;
  }
};

export default UploadFile;
