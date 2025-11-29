import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
// REDUX
import { RootState } from '../../redux/reducers';
import { setIsLoading, setMetaData } from '../../redux/reducers/page';
// API
import GetAllStudentSkillRecordApi from '../../api/SkillRecord/StudentRecord';
// MUI
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
// TOAST
import * as toast from '../../ui/Toast';
// COMPONENT
import RecordLineChart from '../../ui/chart/RecordLineChart';
// HELPERS
import { jalaliDate } from '../../helpers/convertDate.helper';

const RecordChartList = () => {

  const id = Number(useParams().id);
  const dispatch = useDispatch();
  const { auth } = useSelector((state: RootState) => state.userAuth);
  const token = auth.token;

  const [groupedData, setGroupedData] = React.useState({});
  const [selectedSkills, setSelectedSkills] = React.useState([]);
  const [isLoaded, setIsLoaded] = React.useState(false);

  const getSkillRecordList = async () => {
    dispatch(setIsLoading(true));
    const list = await GetAllStudentSkillRecordApi(token, id);

    if (list.status === 403) {
      toast.ErrorNotify('خطای دسترسی !');
      return;
    }

    if (list.status === 200) {
      const grouped = {};

      list.data.forEach((item) => {
        const key = `${item.skill.title} - ${item.skill.area} متر`; // 🔥 کلید ترکیبی ماده + متراژ

        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(item);
      });

      // 🔥 سورت رکوردهای هر ماده براساس تاریخ
      Object.keys(grouped).forEach((key) => {
        grouped[key].sort(
          (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      });

      setGroupedData(grouped);
    }

    dispatch(setIsLoading(false));
    setIsLoaded(true);
  };

  React.useEffect(() => {
    dispatch(
      setMetaData({
        title: 'نمودار رکوردهای شناگر',
        description: 'نمودار رکوردهای مسابقات شنا',
      })
    );
    getSkillRecordList();
  }, []);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <div className="flex flex-col h-full">
        <div className="flex-grow flex items-center justify-center mt-3">
          {isLoaded ? (
            <div className="w-full bg-white shadow-lg rounded-lg">
              <div className="p-4">

                {/* چک‌باکس‌ها */}
                <div className="flex flex-wrap gap-4 mb-4">
                  {Object.keys(groupedData).map((key) => (
                    <FormControlLabel
                      key={key}
                      control={
                        <Checkbox
                          checked={selectedSkills.includes(key)}
                          onChange={() =>
                            setSelectedSkills((prev) =>
                              prev.includes(key)
                                ? prev.filter((s) => s !== key)
                                : [...prev, key]
                            )
                          }
                        />
                      }
                      label={key}
                    />
                  ))}
                </div>

                {/* 🔥 ارسال چند سری */}
                <RecordLineChart
                  key={selectedSkills.join(',')}
                  seriesData={selectedSkills.map((skill) => ({
                    name: skill,
                    data: groupedData[skill] || [],
                  }))}
                />

                {/* لیست رکوردها */}
                {selectedSkills.map((skillName) =>
                  groupedData[skillName].map((item) => (
                    <div
                      key={item.id}
                      className="mt-2 p-2 border-b flex justify-between"
                    >
                      <div className="text-gray-700">
                        <strong>{skillName}</strong> | رکورد: {item.record} | ثبت:{' '}
                        {jalaliDate(item.createdAt)}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            <Skeleton height={300} />
          )}
        </div>
      </div>
    </Box>
  );
};

export default RecordChartList;
