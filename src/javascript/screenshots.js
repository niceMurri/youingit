export default function(){
    const screen = document.querySelector('main');

     html2canvas(screen, { allowTaint: true, useCORS: true })
        .then(canvas => {
            
            const image = canvas.toDataURL("image/png");

            let anchor = document.createElement('a')
            anchor.setAttribute('href', image);
            anchor.setAttribute('download', 'my-card');
            anchor.click();
            anchor.remove();
        });
}