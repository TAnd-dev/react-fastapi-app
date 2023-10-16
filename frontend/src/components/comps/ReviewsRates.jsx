import { ResponsiveBar } from '@nivo/bar';

const ReviewsBar = ({ data }) => (
    <ResponsiveBar
        data={data}
        keys={['1', '2', '3', '4', '5']}
        indexBy="rate"
        margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
        padding={0.9}
        layout="horizontal"
        maxValue={100}
        colors={{ scheme: 'spectral' }}
        axisTop={null}
        axisRight={null}
        axisBottom={null}
        axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legendPosition: 'middle',
            legendOffset: -40,
        }}
        enableLabel={false}
        tooltip={d => `${d.data.count}`}
    />
);

export default ReviewsBar;
