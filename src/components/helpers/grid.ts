import { normalize } from './../helpers/TextTools.helper';

export function loadingGrid(result) {
  let totalLoadingNetWeight = 0;
  let totalLoadingCount = 0;
  const clusterKey = 'geoDestination';
  const cleanedData = [];
  for (const item of result.data) {
    if (item.loading === 1) {
      cleanedData.push(item);
    }
  }
  const groups = cleanedData.reduce((groups, item) => {
    const key =
      item[clusterKey].length > 0 ? normalize(item[clusterKey]) : 'تعیین نشده';

    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
    return groups;
  }, {});
  const groupsByLoadName = cleanedData.reduce((groups, item) => {
    const key = item.loadName;

    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
    return groups;
  }, {});
  const series = Object.keys(groupsByLoadName).map((item) => {
    return {
      data: [],
      name: item,
      stack: 'info',
      emphasis: {
        focus: 'series',
      },
      type: 'bar',
      netWeight: [],
      count: [],
    };
  });
  const data = [];
  const serieData = [];
  Object.keys(groups).map((key) => {
    data.push(key);
    const initialData = series.map((item) => {
      return {
        name: item.name,
        count: 0,
        netWeight: 0,
      };
    });
    let count = 0;
    let netWeight = 0;
    for (const dateInf of groups[key]) {
      const key = dateInf.loadName;
      const loadName = initialData.findIndex((i) => i.name === key);
      if (loadName >= 0) {
        initialData[loadName].count += 1;
        initialData[loadName].netWeight += dateInf.netWeight;
        totalLoadingNetWeight += dateInf.netWeight;
        totalLoadingCount += 1;
      }
      count += 1;
      netWeight += dateInf.netWeight;
    }
    series.map((obj) => {
      obj.data.push(initialData.find((e) => e.name === obj.name).netWeight);
      obj.count.push(initialData.find((e) => e.name === obj.name).count);
      obj.netWeight.push(
        initialData.find((e) => e.name === obj.name).netWeight,
      );
    });
    serieData.push(count);
  });
  const totalLoadingDataGridArr: any[] = [];
  for (let i = 0; i < data.length; i++) {
    for (const serie of series) {
      if (serie.data[i] > 0) {
        totalLoadingDataGridArr.push({
          dest: data[i],
          loadName: serie.name,
          count: serie.count[i],
          netWeight: serie.netWeight[i],
        });
      }
    }
  }
  return { totalLoadingNetWeight, totalLoadingCount, totalLoadingDataGridArr };
}
export function dischargeGrid(result) {
  let totalDischargeNetWeight = 0;
  let totalDischargeCount = 0;
  const clusterKey = 'loadName';
  const cleanedData = [];
  for (const item of result.data) {
    if (item.loading !== 1) {
      cleanedData.push(item);
    }
  }
  const groups = cleanedData.reduce((groups, item) => {
    const key =
      item[clusterKey].length > 0 ? normalize(item[clusterKey]) : 'تعیین نشده';

    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
    return groups;
  }, {});
  const groupsBysource = cleanedData.reduce((groups, item) => {
    const key = item.source.length > 0 ? normalize(item.source) : 'تعیین نشده';

    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
    return groups;
  }, {});

  const series = Object.keys(groupsBysource).map((item) => {
    return {
      data: [],
      name: item,
      stack: 'info',
      emphasis: {
        focus: 'series',
      },
      type: 'bar',
      netWeight: [],
      count: [],
    };
  });
  const data = [];
  Object.keys(groups).map((key) => {
    data.push(key);
    const initialData = series.map((item) => {
      return {
        name: item.name,
        count: 0,
        netWeight: 0,
      };
    });
    let count = 0;
    let netWeight = 0;
    for (const dateInf of groups[key]) {
      const source = initialData.findIndex(
        (i) => i.name === normalize(dateInf.source),
      );
      const iNetWeight = dateInf.netWeight;
      if (source >= 0) {
        initialData[source].count += 1;
        initialData[source].netWeight += iNetWeight;
        totalDischargeNetWeight += iNetWeight;
        totalDischargeCount += 1;
      }
      count += 1;
      netWeight += iNetWeight;
    }
    series.map((obj) => {
      obj.data.push(initialData.find((e) => e.name === obj.name).netWeight);

      obj.netWeight.push(
        initialData.find((e) => e.name === obj.name).netWeight,
      );
      obj.count.push(initialData.find((e) => e.name === obj.name).count);
    });
  });

  const totalDischargeDataGridArr: any[] = [];
  for (let i = 0; i < data.length; i++) {
    for (const serie of series) {
      if (serie.data[i] > 0) {
        totalDischargeDataGridArr.push({
          loadName: data[i],
          source: serie.name,
          count: serie.count[i],
          netWeight: serie.netWeight[i],
        });
      }
    }
  }
  return {
    totalDischargeNetWeight,
    totalDischargeCount,
    totalDischargeDataGridArr,
  };
}
