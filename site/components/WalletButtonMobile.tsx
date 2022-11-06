import { useWallet } from "@solana/wallet-adapter-react";
import { createPortal } from "react-dom";
import { WalletIcon, useWalletModal } from "@solana/wallet-adapter-react-ui";
import type { FC, PropsWithChildren, MouseEvent } from "react";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export const WalletButtonMobile: FC<PropsWithChildren<{}>> = ({
  children,
  ...props
}) => {
  const { connected, publicKey, wallet, disconnect } = useWallet();
  const [modalVisible, setModalVisible] = useState(false);
  const { setVisible } = useWalletModal();
  const [copied, setCopied] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);

  const base58 = useMemo(() => publicKey?.toBase58(), [publicKey]);
  const content = useMemo(() => {
    if (children) return children;
    if (!wallet || !base58) return null;
    return base58.slice(0, 4) + ".." + base58.slice(-4);
  }, [children, wallet, base58]);

  const copyAddress = useCallback(async () => {
    if (base58) {
      await navigator.clipboard?.writeText(base58);
      setCopied(true);
      setTimeout(() => setCopied(false), 400);
    }
  }, [base58]);

  const openModal = useCallback(() => setModalVisible(true), [setModalVisible]);

  const hideModal = useCallback(() => {
    setFadeIn(false);
    setTimeout(() => setModalVisible(false), 150);
  }, [setModalVisible]);

  const openWalletModal = useCallback(() => {
    hideModal();
    setTimeout(() => setVisible(true), 150);
  }, [setVisible, hideModal]);

  const disconnectWallet = useCallback(() => {
    hideModal();
    disconnect();
  }, [hideModal, disconnect]);

  const handleClose = useCallback(
    (event: MouseEvent) => {
      event.preventDefault();
      hideModal();
    },
    [hideModal]
  );

  useEffect(() => {
    if (modalVisible) {
      setTimeout(() => setFadeIn(true), 0);
    }

    const html = document.documentElement;

    html.style.overflow = modalVisible ? "hidden" : "visible";

    return (): void => {
      html.style.overflow = "visible";
    };
  }, [modalVisible]);

  if (!connected) {
    return (
      <div className="lg:hidden select-none left-[250px] top-[309px] h-[25px] w-[103px] justify-center items-center text-[7px] absolute font-medium flex uppercase text-okb-baltic-sea bg-[length:100%_100%]">
        <span className="h-3/6">wallet not connected</span>
        <svg className="w-full h-full absolute -z-10">
          <use href="#wallet-not-connected-mobile" />
        </svg>
      </div>
    );
  }

  return (
    <>
      <button
        className="group lg:hidden flex absolute left-[250px] top-[307px] font-medium absolute text-[10px] font-outfit justify-center items-center z-20 w-[103px] h-[28px] text-okb-citrine-white bg-transparent active:h-[25px] active:mt-[1.5px] active:text-okb-heliotrope tracking-[0.1em]"
        onClick={openModal}
        {...props}
      >
        <div className="h-[77%]">{content}</div>
        <svg className="group-active:hidden hoverful:group-hover:hidden w-full h-full absolute -z-10">
          <use href="#wallet-unpressed-mobile" />
        </svg>
        <svg className="hidden group-active:hidden hoverful:group-hover:flex w-full h-full absolute -z-10">
          <use href="#wallet-unpressed-mobile-hover" />
        </svg>
        <svg className="hidden group-active:flex w-full h-full absolute -z-10">
          <use href="#wallet-pressed-mobile" />
        </svg>
      </button>
      {modalVisible &&
        createPortal(
          <div
            aria-modal="true"
            className={`wallet-adapter-modal ${
              fadeIn ? "wallet-adapter-modal-fade-in" : ""
            }`}
            role="dialog"
          >
            <div className="wallet-adapter-modal-container">
              <div className="wallet-adapter-modal-wrapper">
                <button
                  onClick={handleClose}
                  className="wallet-adapter-modal-button-close"
                >
                  <svg width="14" height="14">
                    <path d="M14 12.461 8.3 6.772l5.234-5.233L12.006 0 6.772 5.234 1.54 0 0 1.539l5.234 5.233L0 12.006l1.539 1.528L6.772 8.3l5.69 5.7L14 12.461z" />
                  </svg>
                </button>
                (
                <>
                  <h1 className="wallet-adapter-modal-title flex items-center">
                    {wallet && (
                      <img
                        src={wallet.adapter.icon}
                        alt={`${wallet.adapter.name} icon`}
                        className="w-6 h-6 mr-2"
                      />
                    )}
                    {content}
                  </h1>
                  <div className="wallet-adapter-modal-middle flex flex-col font-medium font-outfit gap-y-2">
                    <button
                      onClick={copyAddress}
                      className="group relative text-okb-baltic-sea flex items-center justify-center bg-[length:100%_100%] h-12 w-full tracking-[0.1em] uppercase"
                    >
                      {copied ? "copied" : "copy"}
                      <svg className="w-full h-full absolute -z-10">
                        <use
                          className="hoverful:group-hover:hidden"
                          href="#wallet-copy"
                        />
                        <use
                          className="hidden hoverful:group-hover:flex"
                          href="#wallet-copy-hover"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={openWalletModal}
                      className="group relative text-okb-baltic-sea flex items-center justify-center bg-[length:100%_100%] h-12 w-full tracking-[0.1em] uppercase"
                    >
                      change
                      <svg className="w-full h-full absolute -z-10">
                        <use
                          className="hoverful:group-hover:hidden"
                          href="#wallet-copy"
                        />
                        <use
                          className="hidden hoverful:group-hover:flex"
                          href="#wallet-copy-hover"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={disconnectWallet}
                      className="group relative text-okb-baltic-sea flex items-center justify-center bg-[length:100%_100%] h-12 w-full tracking-[0.1em] uppercase"
                    >
                      disconnect wallet
                      <svg className="w-full h-full absolute -z-10">
                        <use
                          className="hoverful:group-hover:hidden"
                          href="#wallet-disconnect"
                        />
                        <use
                          className="hidden hoverful:group-hover:flex"
                          href="#wallet-disconnect-hover"
                        />
                      </svg>
                    </button>
                  </div>
                </>
                )
              </div>
            </div>
            <div
              className="wallet-adapter-modal-overlay"
              onMouseDown={handleClose}
            />
          </div>,
          document.body
        )}
    </>
  );
};
