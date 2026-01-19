import classes from "@/app/sectionOne.module.css";
import { Container, Overlay, Title } from "@mantine/core";

export default function HeaderImageFull(props: any){
  return (
      <div className={classes.hero} style={{
        backgroundImage: `url(${props.image})`,
        backgroundAttachment: props.imageFixed ? 'fixed' : undefined,
      }}>
        <Overlay
            gradient="linear-gradient(90deg, rgba(0, 0, 0, 100) 0%, rgba(0, 0, 0, 0) 46%)"
            opacity={1}
            zIndex={1}
        />
        <Container className={classes.container} fluid>
          <Title className={classes.title} ml={'6%'}
                 dangerouslySetInnerHTML={{__html: props.title}} />
        </Container>
      </div>
  )
}