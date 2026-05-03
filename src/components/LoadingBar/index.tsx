import './styles.css';

export const LoadingBar = ({ ...props }) => {
  return (
    <div id="loading-bar" {...props}>
      <div className="progress">
        <div className="progress-bar"></div>
      </div>
    </div>
  );
};
