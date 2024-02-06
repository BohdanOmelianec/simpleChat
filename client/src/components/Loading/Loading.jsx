import "./loading.scss";

const Loading = ({ loading }) => {
    return (
        <div className="loading_bg" style={{ display: loading ? "grid" :"none"}}>
            <div className="loading_spinner">Loading...</div>
        </div>
    );
}

export default Loading;