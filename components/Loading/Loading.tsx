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
                    style={{ zIndex: zIndexLevel.three }}
                >
                    <Image
                        src={loadingPhoto}
                        alt="Loading"
                        className={styles.animal}
                        unoptimized={true}
                        style={{ zIndex: zIndexLevel.four }}
                    />
                </div>
            )}
        </>
    );
};

export default Loading;
