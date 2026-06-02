// @ts-nocheck
import { useParams, Link, useLocation } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { getDistanceKm } from '@/apis/utils';
import Comments from './Comments';

import './StationDetail.css'
import './Form.css'

function parsePrice(value) {
  if (value == null) return null;
  const normalized = value.toString().replace(',', '.').replace(/[^0-9.]/g, '');
  return normalized ? parseFloat(normalized) : null;
}

function formatPrice(value) {
  return value == null ? '-' : value.toFixed(3).replace('.', ',');
}

function seededNoise(seed) {
  let value = seed % 2147483647;
  value = (value * 16807) % 2147483647;
  return (value - 1) / 2147483646;
}

function getCoords(station) {
  return [
    parseFloat(station['Latitud'].replace(',', '.')),
    parseFloat(station['Longitud (WGS84)'].replace(',', '.')),
  ];
}

function getNeighborStations(station, stations) {
  const [lat, lon] = getCoords(station);
  return stations
    .filter(s => s.IDEESS !== station.IDEESS)
    .map(s => {
      const [sLat, sLon] = getCoords(s);
      return {
        station: s,
        distance: getDistanceKm(lat, lon, sLat, sLon),
      };
    })
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 5)
    .map(item => item.station);
}

function stationSeed(station, salt = 0) {
  return station.IDEESS
    .split('')
    .reduce((sum, char) => sum + char.charCodeAt(0), 0) + salt;
}

function generateStationSeries(station, fuelKey, days = 365) {
  const basePrice = parsePrice(station[fuelKey]) || 1.2;
  const seed = stationSeed(station, fuelKey === 'Precio Gasolina 95 E5' ? 1000 : 0);
  const history = [];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days + 1);

  for (let dayIndex = 0; dayIndex < days; dayIndex += 1) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + dayIndex);
    const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 86400000);
    const seasonal = Math.sin((2 * Math.PI * dayOfYear) / 365) * 0.04;
    const trend = ((seed % 8) - 3.5) * 0.00008;
    const noise = (seededNoise(seed + dayIndex * 31) - 0.5) * 0.02;
    const issue = (seededNoise(seed + dayIndex * 17) - 0.5) * 0.01;
    const price = Math.max(0.5, basePrice + seasonal + trend * dayIndex + noise + issue);
    history.push({
      date: date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }),
      price,
    });
  }

  return history;
}

function average(values) {
  if (!values.length) return 0;
  return values.reduce((sum, item) => sum + item, 0) / values.length;
}

function standardDeviation(values) {
  if (!values.length) return 0;
  const mean = average(values);
  const squared = values.map(value => (value - mean) ** 2);
  return Math.sqrt(average(squared));
}

function buildTrainingData(stations, fuelKey) {
  const data = [];

  stations.forEach(station => {
    const neighbors = getNeighborStations(station, stations);
    if (neighbors.length === 0) return;

    const baseSeries = generateStationSeries(station, fuelKey);
    const neighborSeries = neighbors.map(neighbor => generateStationSeries(neighbor, fuelKey));

    for (let idx = 30; idx < baseSeries.length - 1; idx += 1) {
      const price = baseSeries[idx].price;
      const lastWeek = baseSeries.slice(idx - 7, idx).map(item => item.price);
      const lastMonth = baseSeries.slice(idx - 30, idx).map(item => item.price);
      const nextDay = baseSeries[idx + 1].price;

      const neighborCurrent = neighborSeries.map(series => series[idx].price);
      const neighborLastWeek = neighborSeries.map(series => series[idx].price - series[idx - 7].price);

      const features = {
        currentPrice: price,
        weeklyChange: price - lastWeek[0],
        volatility: standardDeviation(lastMonth),
        neighborWeeklyChange: average(neighborLastWeek),
        relativePrice: price - average(neighborCurrent),
        dayOfWeek: new Date(baseSeries[idx].date.split('/').reverse().join('-')).getDay(),
        month: new Date(baseSeries[idx].date.split('/').reverse().join('-')).getMonth() + 1,
      };

      data.push({
        features,
        label: nextDay > price ? 1 : 0,
      });
    }
  });

  return data;
}

function sampleWithReplacement(items) {
  const sample = [];
  for (let i = 0; i < items.length; i += 1) {
    sample.push(items[Math.floor(Math.random() * items.length)]);
  }
  return sample;
}

function giniImpurity(subset) {
  if (!subset.length) return 0;
  const positives = subset.filter(item => item.label === 1).length;
  const negatives = subset.length - positives;
  const pPos = positives / subset.length;
  const pNeg = negatives / subset.length;
  return 1 - pPos * pPos - pNeg * pNeg;
}

function bestStump(samples, featureNames) {
  let best = null;
  let bestScore = Infinity;

  featureNames.forEach(feature => {
    const values = Array.from(new Set(samples.map(item => item.features[feature]))).sort((a, b) => a - b);
    if (values.length < 2) return;

    const thresholds = values.filter((_, index) => index % Math.max(1, Math.floor(values.length / 10)) === 0);
    thresholds.push(values[values.length - 1]);

    thresholds.forEach(threshold => {
      const left = samples.filter(item => item.features[feature] <= threshold);
      const right = samples.filter(item => item.features[feature] > threshold);
      const score = (left.length * giniImpurity(left) + right.length * giniImpurity(right)) / samples.length;
      if (score < bestScore) {
        bestScore = score;
        best = {
          feature,
          threshold,
          leftProb: left.length ? average(left.map(item => item.label)) : 0,
          rightProb: right.length ? average(right.map(item => item.label)) : 0,
        };
      }
    });
  });

  return best || {
    feature: featureNames[0],
    threshold: 0,
    leftProb: 0.5,
    rightProb: 0.5,
  };
}

function trainRandomForest(samples, featureNames, nTrees = 7) {
  return Array.from({ length: nTrees }, () => {
    const sample = sampleWithReplacement(samples);
    const chosenFeatures = featureNames
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.max(3, Math.min(featureNames.length, 4)));
    return bestStump(sample, chosenFeatures);
  });
}

function predictForestProbability(forest, features) {
  if (!forest.length) return 0.5;
  const results = forest.map(tree => {
    const value = features[tree.feature];
    return value <= tree.threshold ? tree.leftProb : tree.rightProb;
  });
  return average(results);
}

function buildPredictionFeatures(station, neighbors, fuelKey) {
  const series = generateStationSeries(station, fuelKey);
  const neighborSeries = neighbors.map(neighbor => generateStationSeries(neighbor, fuelKey));
  const idx = series.length - 1;
  const price = series[idx].price;
  const lastWeek = series.slice(idx - 7, idx).map(item => item.price);
  const lastMonth = series.slice(idx - 30, idx).map(item => item.price);
  const neighborCurrent = neighborSeries.map(seriesItem => seriesItem[idx].price);
  const neighborLastWeek = neighborSeries.map(seriesItem => seriesItem[idx].price - seriesItem[idx - 7].price);

  return {
    currentPrice: price,
    weeklyChange: price - lastWeek[0],
    volatility: standardDeviation(lastMonth),
    neighborWeeklyChange: average(neighborLastWeek),
    relativePrice: price - average(neighborCurrent),
    dayOfWeek: new Date().getDay(),
    month: new Date().getMonth() + 1,
  };
}

function predictThreeDayDelta(station, neighbors, fuelKey = 'Precio Gasoleo A') {
  const series = generateStationSeries(station, fuelKey);
  const neighborSeries = neighbors.map(neighbor => generateStationSeries(neighbor, fuelKey));
  const idx = series.length - 1;
  const stationSlope = series[idx].price - series[idx - 7].price;
  const neighborSlopes = neighborSeries.map(item => item[idx].price - item[idx - 7].price);
  const neighborSlope = average(neighborSlopes);
  const change = stationSlope * 0.6 + neighborSlope * 0.4;
  return change * 3 * 100; // return in céntimos
}

function generateHistory(station) {
  const currentGasoleo = parsePrice(station['Precio Gasoleo A']);
  const currentGas95 = parsePrice(station['Precio Gasolina 95 E5']);
  const idSeed = station.IDEESS
    .split('')
    .reduce((sum, char) => sum + char.charCodeAt(0), 0);

  const historyDays = Array.from({ length: 7 }, (_, idx) => idx - 6);
  const baseDate = new Date();
  const gasoleoHistory = [];
  const gas95History = [];

  historyDays.forEach(dayOffset => {
    const date = new Date(baseDate);
    date.setDate(baseDate.getDate() + dayOffset);
    const dateString = date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
    });

    const offsetSeed = idSeed + dayOffset * 31;
    const noiseA = seededNoise(offsetSeed);
    const noise95 = seededNoise(offsetSeed + 17);

    const gasAValue = currentGasoleo
      ? Math.max(0.5, currentGasoleo + (noiseA - 0.5) * 0.08)
      : null;
    const gas95Value = currentGas95
      ? Math.max(0.5, currentGas95 + (noise95 - 0.5) * 0.08)
      : null;

    gasoleoHistory.push({ date: dateString, price: gasAValue });
    gas95History.push({ date: dateString, price: gas95Value });
  });

  return {
    gasoleoHistory,
    gas95History,
  };
}

function StationDetail({ stations, user }) {
  const location = useLocation();
  const { gobackLink } = location.state || { gobackLink: '/' };
  const { id } = useParams();
  const station = stations.find(s => s.IDEESS === id);
  const [predictionMessage, setPredictionMessage] = useState('');

  const history = useMemo(() => {
    return station ? generateHistory(station) : { gasoleoHistory: [], gas95History: [] };
  }, [station]);

  if (!station) return <div>Estación no encontrada</div>;

  const handlePrediction = () => {
    const neighbors = getNeighborStations(station, stations);
    const featureNames = [
      'currentPrice',
      'weeklyChange',
      'volatility',
      'neighborWeeklyChange',
      'relativePrice',
      'dayOfWeek',
      'month',
    ];

    const trainingData = buildTrainingData([station, ...neighbors], 'Precio Gasoleo A');
    const forest = trainRandomForest(trainingData, featureNames, 7);
    const currentFeatures = buildPredictionFeatures(station, neighbors, 'Precio Gasoleo A');
    const probability = predictForestProbability(forest, currentFeatures);
    const probabilityPercent = Math.round(probability * 100);
    const direction = probability >= 0.5 ? 'subir' : 'bajar';

    const deltaCents = predictThreeDayDelta(station, neighbors, 'Precio Gasoleo A');
    const deltaDirection = deltaCents >= 0 ? 'subir' : 'bajar';
    const deltaValue = Math.abs(deltaCents).toFixed(1);

    setPredictionMessage(
      `Según el modelo, esta gasolinera tiene un ${probabilityPercent}% de probabilidad de ${direction} el precio en las próximas 24 horas. ` +
      `Según el histórico se estima que el precio del gasóleo ${deltaDirection} ${deltaValue} céntimos durante los próximos 3 días.`
    );
  };

  return (
    <div className='station-detail'>
      <h1>Detalles de la Estación</h1>
      <h2>{station['Rótulo']}</h2>
      <p><strong>Dirección:</strong> {station['Dirección']}</p>
      <p><strong>Municipio:</strong> {station['Municipio']}</p>
      <p><strong>Gasóleo A:</strong> {station['Precio Gasoleo A']}</p>
      <p><strong>Gasolina 95 E5:</strong> {station['Precio Gasolina 95 E5']}</p>

      <section className='history-section'>
        <h3>Histórico de precios</h3>
        <div className='history-tables'>
          <div className='history-table'>
            <h4>Gasóleo A</h4>
            <table>
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Precio</th>
                </tr>
              </thead>
              <tbody>
                {history.gasoleoHistory.map((item, index) => (
                  <tr key={`gasoleo-${index}`}>
                    <td>{item.date}</td>
                    <td>{formatPrice(item.price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className='history-table'>
            <h4>Gasolina 95 E5</h4>
            <table>
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Precio</th>
                </tr>
              </thead>
              <tbody>
                {history.gas95History.map((item, index) => (
                  <tr key={`gas95-${index}`}>
                    <td>{item.date}</td>
                    <td>{formatPrice(item.price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <button type='button' className='prediction-button' onClick={handlePrediction}>
        Predicción IA
      </button>
      {predictionMessage && <p className='prediction-message'>{predictionMessage}</p>}

      <Link to={gobackLink} className='back-link'> &lt;&lt; Volver</Link>

      <Comments stationId={station.IDEESS} user={user} />
    </div>
  );
}

export default StationDetail;
