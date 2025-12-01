import { ref, type Ref, onMounted, watch } from "vue";
import { useElementSize } from "@vueuse/core";

/**
 * En Vue-composable för att hantera horisontell drag-to-resize funktionalitet.
 * Används för att ändra fördelningen på bredd mellan två element genom att dra
 * i ett handtag.
 *
 * @param mainRef - Referens till huvudbehållaren
 * @param handleRef - Referens till draghandtaget
 * @param element1Ref - Referens till det ena elementet vars bredd ska ändras
 * @param element2Ref - Referens till det andra elementet vars bredd ska ändras
 * @param minimumElement1Width - Standardbredd på ena elementet
 * @param minimumElement2Width - Standardbredd på andra elementet
 *
 * @returns Ett objekt som innehåller funktionen för att hantera dragning, skall
 * placeras på @mousedown på draghandtaget.
 */
export function useHorizontalDrag(
  mainRef: Ref<HTMLElement | null>,
  handleRef: Ref<HTMLElement | null>,
  element1Ref: Ref<HTMLElement | null>,
  element2Ref: Ref<HTMLElement | null>,
  minimumElement1Width: number,
  minimumElement2Width: number,
) {
  const defaultElement2Width = ref<number | null>(null);

  function resizeElement(elementWidth: number) {
    if (
      !mainRef.value ||
      !handleRef.value ||
      !element1Ref.value ||
      !element2Ref.value ||
      !defaultElement2Width.value
    ) {
      return;
    }

    let newTargetWidth =
      mainRef.value.clientWidth -
      elementWidth -
      handleRef.value.clientWidth -
      16;

    if (
      newTargetWidth < minimumElement2Width ||
      newTargetWidth > defaultElement2Width.value
    ) {
      newTargetWidth = Math.min(defaultElement2Width.value, newTargetWidth);
      newTargetWidth = Math.max(minimumElement2Width, newTargetWidth);
      elementWidth =
        mainRef.value.clientWidth -
        newTargetWidth -
        handleRef.value.clientWidth -
        16;
    }

    element1Ref.value.style.width = elementWidth + "px";
    element2Ref.value.style.width = `${newTargetWidth}px`;
    element2Ref.value.style.transform = `scale(${Math.min(1, newTargetWidth / defaultElement2Width.value)})`;
  }

  function handleDrag(mouseDown: MouseEvent) {
    if (
      !mainRef.value ||
      !handleRef.value ||
      !element1Ref.value ||
      !element2Ref.value ||
      !defaultElement2Width.value
    ) {
      return;
    }

    // För att förhindra att saker blir markerade iom mousedown
    mouseDown.preventDefault();

    let dragX = mouseDown.clientX;
    const element = element1Ref.value;

    const onMouseMove = (mouseMove: MouseEvent) => {
      const elementWidth = element.offsetWidth + mouseMove.clientX - dragX;
      resizeElement(elementWidth);
      dragX = mouseMove.clientX;
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  }

  onMounted(() => {
    defaultElement2Width.value = element2Ref.value?.clientWidth ?? 0;
    if (element1Ref.value) {
      if (element1Ref.value.clientWidth < minimumElement1Width) {
        resizeElement(minimumElement1Width);
      } else {
        resizeElement(0); // Så element2 tar så mycket plats som möjligt
      }
    }

    if (mainRef.value) {
      const { width: mainWidth } = useElementSize(mainRef.value);
      watch(mainWidth, () => {
        if (element1Ref.value) {
          resizeElement(element1Ref.value.clientWidth);
        }
      });
    }
  });

  return {
    handleDrag,
  };
}
