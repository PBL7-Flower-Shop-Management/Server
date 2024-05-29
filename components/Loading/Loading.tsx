import Image from "next/image";
import styles from "./Loading.module.css";
import loadingPhoto from "@/Public/images/loading.gif";
import { zIndexLevel } from "@/utils/constants";

const Loading = ({ isShow }: any) => {
    return (
        <>
            {isShow && (
                <div
                    className={styles.container}
                    style={{ zIndex: zIndexLevel.five }}
                >
                    <Image
                        src={loadingPhoto}
                        alt="Loading"
                        className={styles.animal}
                        unoptimized={true}
                        style={{ zIndex: zIndexLevel.six }}
                    />
                </div>
            )}
        </>
    );
};

export default Loading;
