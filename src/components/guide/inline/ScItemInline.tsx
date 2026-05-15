export function ScItemInline({ itemName }: { itemName: string }) {
  return (
    <span className="mx-0.5 font-semibold text-[#e8c34b]" title={itemName}>
      {itemName}
    </span>
  );
}
